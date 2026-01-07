# Workflow for Gardening Buddy Hackathon

## 🌳 Branching Strategy

- **`main`**: The "Golden Master". Only working code goes here.
- **`frontend`**: All frontend work happens here.
- **`backend`**: All backend work happens here.

## 🔄 How to Work

1.  **Always pull before starting**:
    ```bash
    git pull origin <your-branch>
    ```

2.  **Commit often**:
    ```bash
    git add .
    git commit -m "feat: added plant selector component"
    ```

3.  **Sync with Main**:
    Run the sync script to pull updates from main into your branch and push your work.
    ```powershell
    ./scripts/sync_work.ps1
    ```

## 🚨 Conflict Resolution
If the sync script warns of conflicts:
1. Open the files with `<<<<<<<`.
2. Decide which code to keep (Current vs Incoming).
3. Save.
4. `git add .`
5. `git commit -m "fix: resolved merge conflict"`
6. `git push`
