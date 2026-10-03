# Putting Breakpoint online

A step-by-step guide to running the site for a real class, written for Railway (it builds straight from GitHub, gives the site HTTPS and a disk for the database, and updates itself when the code changes). Any host that runs an ordinary Node.js server with a disk will do; see the end for a college server.

## What the site needs

- **A server that keeps running, with a disk.** The database is one SQLite file, which needs a disk that survives updates (on Railway, a volume).
- **2 GB of memory** for 60 students. Each Submit is marked in its own small Python process of about 200 MB, four at a time (`JUDGE_CONCURRENCY`). Measured on a laptop: 60 submissions sent at the same moment were all marked within 20 seconds, half of them within 10. "Run examples" happens in each student's own browser and costs the server nothing. With only 1 GB, set `JUDGE_CONCURRENCY` to 2: marking still works, just with a longer queue at busy moments.
- **Node.js 22.13 or newer.** The marker's sandbox needs it. `package.json` and `.node-version` ask the host for it.
- **HTTPS.** Passwords are typed into the site, so it must never be reached over plain HTTP. Railway's addresses are HTTPS already.

## 1. Before you start (once)

1. **Make the GitHub repository private.** The challenge files hold every model answer and hidden test, including the competition packs. On GitHub: the repository → Settings → General → Danger zone → Change visibility → Private. Railway can still deploy it.
2. **Turn on two-step sign-in** (two-factor authentication) for your GitHub and Railway accounts. Whoever controls those controls the site and its data.
3. **Speak to your data protection officer.** The site stores each student's name, username, class, a one-way hash of their password, the code they submit and, with each submission, how much was typed and pasted and for how long. No email addresses. Hosting in the EU region (below) keeps the data in Europe. They may want a data protection impact assessment and a line in the privacy notice for students; tell students that pasting is recorded.
4. **Ask college IT** to let the site's address through the web filter (and onto student devices), once you know it (step 2.7).
5. **Choose your teacher password**: at least 12 characters (the live site refuses a shorter one), used nowhere else, kept in a password manager.

## 2. Set it up on Railway (about 20 minutes)

1. Go to railway.com and sign in with GitHub. A volume needs a paid plan (Hobby is enough for one college).
2. **New project → Deploy from GitHub repo →** `MacTR11/breakpoint`, branch `main`. The first deploy will fail until the settings below are in; that is expected.
3. **Region:** the service's Settings → Region → an EU region (for example EU West, Amsterdam).
4. **Volume:** right-click the service on the project canvas → Attach volume → mount path `/data`. This is where the database lives; it is kept when the site is updated.
5. **Variables:** the service → Variables → Raw editor, paste this and fill it in:

   ```
   DATABASE_URL="file:/data/breakpoint.db"
   AUTH_SECRET=""
   AUTH_TRUST_HOST="true"
   TEACHER_USERNAME="teacher"
   TEACHER_PASSWORD=""
   TEACHER_NAME=""
   NEXT_PUBLIC_SITE_NAME="Breakpoint"
   JUDGE_CONCURRENCY="4"
   ```

   - `AUTH_SECRET`: on your Mac, run `openssl rand -base64 32` in Terminal and paste the result. It signs everyone's sign-in cookies: never share it.
   - `TEACHER_USERNAME` must not be any student's username.
   - Do not set `NEXT_DIST_DIR` or `DEV_ALLOWED_ORIGINS` on Railway; they are for your Mac only.
6. **Deploy settings** (the service → Settings → Deploy):
   - **Custom start command:** `npm run release && npm start`. Each time the site starts, this creates or updates the database tables, loads the challenges and competition packs (students keep all their progress), and then starts the site.
   - **Healthcheck path:** `/api/health`. Railway waits for this to answer before switching to a new version.
   - **Memory:** 2 GB, if your plan lets you set it.
7. **Address:** Settings → Networking → Generate domain. You get an address like `https://breakpoint-production.up.railway.app`. A college address (such as `code.yourcollege.ac.uk`) can be added later as a custom domain; IT would add one DNS record.
8. **Deploy:** Deployments → Deploy (or Redeploy). In the logs you should see `Seeded 404 problems and 14 competition packs.` and then the site starting.
9. Open the address and sign in with your teacher username and password.

## 3. Check it before students arrive

- [ ] `https://your-address/api/health` shows `{"ok":true}`.
- [ ] Teacher → Settings → **Download a backup** gives you a `.db` file.
- [ ] Teacher → Classes: add your classes (two lower sixth, two upper sixth).
- [ ] Teacher → Students → Add students: make one test student. On a phone, on the college Wi-Fi and on mobile data, sign in as them, press Run and Submit on a challenge, and start a live lesson for their class to see it arrive.
- [ ] Delete the test student (press and hold Delete on their page), or they will appear on the leaderboards.

## 4. Add the students

1. Teacher → Students → Add students → import a CSV with `name` and `class` columns (usernames and passwords are made for you if you leave them out).
2. The sign-in sheet is the only time the passwords can be read. Print it, cut it up, and give each student only their own line. Do not email or share the whole sheet.
3. In the first lesson, have everyone sign in, open any challenge and press **Run examples** once. The first run downloads Python into the browser (about 13 MB); doing it then saves 60 downloads at once in a timed lesson.

## 5. Keeping it safe

- **Your account can see every student.** Sign out of classroom computers. If you might have left yourself signed in somewhere, Teacher → Settings → **Sign out everywhere**. A teacher sign-in ends after 12 hours anyway.
- **Changing your password:** change `TEACHER_PASSWORD` in Railway's variables. It redeploys, and every old teacher sign-in stops working.
- **If `AUTH_SECRET` ever leaks**, replace it in Railway with a new one: everyone is signed out, and no data is lost.
- **A student's password shared or forgotten:** open the student and set a new one; that signs them out everywhere. Five wrong passwords in a row lock a username for a while, so passwords cannot be guessed quickly.
- **What students can never see:** hidden tests, model answers and mark schemes before solving, unpaid hints, other students' code, paste flags and backups. The end-to-end tests (`npm run e2e`) check this; run them after any change.
- **Who else has access:** keep the Railway project and the GitHub repository to yourself (and whoever maintains the code).
- **Keep it up to date:** Next.js and the other parts get security fixes. Every half term or so, ask for the dependencies to be updated and the tests run, then let it redeploy.
- **The end of the year:** download a backup, then delete students who have left, in line with your college's retention policy.

## 6. A five-minute weekly routine

- Teacher → Settings → **Download a backup**, and keep it where your college allows student data (not a personal device). Keep a few weeks of them.
- Glance at Teacher → Students for anything odd: paste flags, or someone who has not signed in.
- Railway → Usage: check the cost is what you expect.

## 7. Know when it is down

Set up a free uptime monitor (for example UptimeRobot) to check `https://your-address/api/health` every 5 minutes and email you if it stops answering.

## 8. Updating the site

Changes pushed to `main` on GitHub are built and deployed by Railway automatically, in a few minutes. Because the database disk moves to the new version, the site is usually unavailable for up to a minute while it switches, so push updates outside lessons (or turn off automatic deploys in Railway's settings and press Deploy when it suits you). New challenges in `content/` go live with the next deploy; nobody loses progress.

## 9. If something goes wrong

- **The site will not load:** Railway → Deployments → the latest deployment → Logs. If a new version broke it, open the previous deployment and choose **Redeploy** to go back to it.
- **"The judge could not start"** on Submit: usually memory. Give the service more memory, or set `JUDGE_CONCURRENCY` to 2.
- **Marking is slow in a busy lesson:** submissions queue, four at a time; 60 at once take up to about 20 to 40 seconds. Each extra marker needs about 200 MB, so raise memory and `JUDGE_CONCURRENCY` together.
- **You are locked out of the teacher account:** wait 15 minutes, or set a new `TEACHER_PASSWORD` in Railway.
- **Data lost or damaged:** restore from the most recent backup. If your Railway plan has volume backups, restore the volume from there. Otherwise the backup file has to be copied over `/data/breakpoint.db` with the site stopped, using the Railway command-line tool; get help with this the first time.

## Other places to host it

- **A college server:** Node.js 22.13 or newer, the same variables in the environment (`DATABASE_URL` pointing at a file on a disk that is backed up), then `npm ci`, `npm run build`, and `npm run release && npm start` under a service manager, behind IT's HTTPS proxy.
- **Vercel** needs the database moved to PostgreSQL first; see the README.
