# Contributing to Playgrounds

Thanks for your interest in this project.

This is primarily a personal project, but it's designed to be forked and extended with your own playgrounds.

---

## What's worth contributing

- Bug fixes
- Improvements to documentation
- New playgrounds that follow the existing content/island pattern
- Performance or accessibility improvements
- Better default styles

## What's probably out of scope

- Highly specific personal features
- Backend / server-side functionality
- CMS integrations (the project is intentionally static)

---

## How to contribute

### 1. Fork the repository

Click **Fork** on the GitHub page.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_ACCOUNT/playgrounds.git
cd playgrounds
```

### 3. Install dependencies

```bash
npm install
```

### 4. Make your changes

Run locally to verify:

```bash
npm run dev
```

If you're adding a playground, follow [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

### 5. Commit with a clear message

```bash
git commit -m "fix: correct layout on mobile"
git commit -m "feat: add cellular-automata playground"
git commit -m "docs: clarify content guide"
```

Prefix convention: `fix:`, `feat:`, `docs:`, `style:`, `refactor:`

### 6. Open a Pull Request

Go to the original repository and open a PR with a short description of what you changed and why.

---

## Questions

Open an [Issue](../../issues) — bug reports and feature ideas are welcome.
