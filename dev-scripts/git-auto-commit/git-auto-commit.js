/**
 * Auto Git Commit Script
 * ----------------------
 * Watches file changes in the project (except node_modules & .git)
 * Automatically stages and commits changes with detailed, single-line commit messages.
 *
 * Features:
 * - Tracks added, modified, and deleted files separately
 * - Builds a concise commit message with timestamp and file summaries
 * - Auto-commits after 1.5 seconds of no further changes
 */

const chokidar = require('chokidar');
const { exec } = require('child_process');

// =======================================================================
// Section 1: Track file changes (added, changed, deleted)
// =======================================================================

const changes = {
  added: new Set(),
  changed: new Set(),
  deleted: new Set(),
};

// =======================================================================
// Section 2: Initialize file watcher with chokidar
// =======================================================================

const watcher = chokidar.watch('.', {
  ignored: /node_modules|\.git/,  // ignore node_modules and git metadata folder
  persistent: true,               // keep watching indefinitely
});

// =======================================================================
// Section 3: Helper function to format file lists for commit message
// =======================================================================

/**
 * Format file list summary for commit messages.
 * Shows number of files and first few filenames (up to 2), plus count if more.
 * @param {Set<string>} files - Set of file paths
 * @returns {string} - Formatted summary string
 */
function formatFilesSummary(files) {
  if (files.size === 0) return '';

  const arr = Array.from(files);
  const displayed = arr.slice(0, 2).join(', ');
  const moreCount = arr.length > 2 ? ` +${arr.length - 2} more` : '';
  
  // For better clarity, replace slashes with dashes in filenames
  const cleanDisplayed = displayed.replace(/\//g, '-');

  return `${arr.length} (${cleanDisplayed}${moreCount})`;
}

// =======================================================================
// Section 4: Build concise single-line commit message
// =======================================================================

/**
 * Creates a single-line commit message with timestamp and file changes summary.
 * @returns {string} - Commit message string
 */
function buildCommitMessage() {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const parts = [];
  if (changes.added.size) parts.push(`Added: ${formatFilesSummary(changes.added)}`);
  if (changes.changed.size) parts.push(`Modified: ${formatFilesSummary(changes.changed)}`);
  if (changes.deleted.size) parts.push(`Deleted: ${formatFilesSummary(changes.deleted)}`);

  // Join parts with semicolons for readability
  return `Auto Commit [${timestamp}] — ${parts.join('; ')}`;
}

// =======================================================================
// Section 5: Perform git add and commit with error handling
// =======================================================================

/**
 * Runs git add and git commit commands using child_process.exec.
 * Clears tracked changes after successful commit.
 */
function gitAddCommit() {
  // Skip if no changes detected
  if (!changes.added.size && !changes.changed.size && !changes.deleted.size) return;

  exec('git add .', (addErr, addStdout, addStderr) => {
    if (addErr) {
      console.error(`git add error: ${addStderr}`);
      return;
    }

    const commitMessage = buildCommitMessage();
    const commitCmd = `git commit -m "${commitMessage}"`;

    exec(commitCmd, (commitErr, commitStdout, commitStderr) => {
      if (commitErr) {
        // Ignore error if nothing to commit
        if (commitStderr.includes('nothing to commit')) return;
        console.error(`git commit error: ${commitStderr}`);
        return;
      }

      console.log(`Committed: ${commitMessage}`);

      // Clear changes sets after successful commit
      changes.added.clear();
      changes.changed.clear();
      changes.deleted.clear();
    });
  });
}

// =======================================================================
// Section 6: Debounced event handler for chokidar watcher
// =======================================================================

let commitTimeout = null;

watcher.on('all', (event, filePath) => {
  // Track file changes based on event type
  switch(event) {
    case 'add':
    case 'addDir':
      changes.added.add(filePath);
      changes.changed.delete(filePath);
      changes.deleted.delete(filePath);
      break;

    case 'change':
      // Only mark as changed if not newly added in this batch
      if (!changes.added.has(filePath)) changes.changed.add(filePath);
      break;

    case 'unlink':
    case 'unlinkDir':
      changes.deleted.add(filePath);
      changes.added.delete(filePath);
      changes.changed.delete(filePath);
      break;
  }

  // Reset debounce timer to commit after 1.5 seconds of inactivity
  if (commitTimeout) clearTimeout(commitTimeout);
  commitTimeout = setTimeout(() => {
    gitAddCommit();
  }, 1500);
});

// =======================================================================
// Section 7: Start message
// =======================================================================

console.log('Watching for file changes... Auto commits will be created automatically.');
