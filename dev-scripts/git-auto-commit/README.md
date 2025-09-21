# Auto Git Commit Script

Automatically watches your project files for changes and creates Git commits with concise, descriptive messages — without manual staging or committing. This keeps your Git history continuously updated as you work.

---

## 📋 Features

* Watches all project files except ignored folders like `node_modules`, `.git`, `dist`, `build`, and your scripts folder.
* Tracks added, modified, and deleted files separately for clear commit summaries.
* Creates single-line commit messages with timestamp and a brief summary of changed files.
* Automatically commits 1.5 seconds after the last file change to group rapid edits.
* Does **not** push commits automatically; you control when to push.
* Simple to integrate into any Node.js project.

---

## 🛠️ Setup Instructions

### 1. Add the script and config files to your project

Structure your project like this:

```
your-project/
├── scripts/
│   └── git-auto-commit/
│       └── git-auto-commit.js      # The auto-commit watcher script
├── package.json                    # Include autocommit command & dependencies
├── .gitignore                     # Your usual ignore rules
└── (other project files)
```

---

### 2. Sample `package.json` snippet

Add this script command and dependency:

```json
{
  "scripts": {
    "autocommit": "node scripts/git-auto-commit/git-auto-commit.js"
  },
  "devDependencies": {
    "chokidar": "^4.0.3"
  }
}
```

---

### 3. Install dependencies

From your project root, run:

```bash
npm install
```

---

### 4. Run the auto-commit watcher

Start the watcher by running:

```bash
npm run autocommit
```

What happens:

* The script watches your project files for changes (except ignored folders).
* When files are added, changed, or deleted, it stages all changes and commits them automatically.
* Commits happen 1.5 seconds after your last change to batch multiple edits.
* Commit messages clearly indicate added, modified, or deleted files with examples.
* The console displays commit info in real time.

---

### 5. Push your commits manually

You control when to push your commits to the remote repo:

```bash
git push
```

This manual step helps avoid unintended pushes and gives you control over your code history.

---

## ⚙️ How It Works

* Uses [`chokidar`](https://github.com/paulmillr/chokidar) to efficiently watch for file system changes.
* Tracks added, modified, and deleted files separately for clear commit summaries.
* After 1.5 seconds of inactivity, runs `git add .` to stage all changes.
* Commits with a single-line message including timestamp and file change summary.
* Ignores key folders (`.git`, `node_modules`, and the script folder) to avoid noise.
* Runs continuously until you stop it.

---

## 🚫 Limitations & Notes

* The script **does not push** commits automatically — pushing is manual for safety.
* Commit messages are concise summaries, not full detailed diffs.
* Best suited for small to medium projects; large projects might generate many commits quickly.
* Restart the script if you want to reset any internal state or for daily fresh runs.

---

## 💡 Customization Tips

You can adjust:

* **Ignored folders** in the watcher options (`git-auto-commit.js`).
* **Commit message format** in the message builder function.
* The **debounce delay** (currently 1.5 seconds) for committing after changes.
* Add limits or integrate pushing automation if desired.

---

## 🙋 Need Help?

If you want:

* A version that pushes commits automatically at the end of the day.
* Integration with CI/CD or other workflows.
* Assistance with setup or customization.

Feel free to reach out!

---

Happy coding and effortless committing! 🎉

---