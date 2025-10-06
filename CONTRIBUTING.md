# Contributing to Learning Compass 🧭

Thank you for your interest in contributing! We welcome contributions from everyone, whether you're a developer or just passionate about education.

## 🎓 How to Suggest a Course

### For Non-Technical Users (Easiest Way)
1. **Click the "Suggest a Course" button** on our website, OR
2. **[Open a Course Suggestion Issue](https://github.com/SpitFiyah/Learning-Compass/issues/new?assignees=&labels=course-suggestion%2Cenhancement&template=course-suggestion.yml&title=%5BCOURSE%5D%3A+)** on GitHub
3. Fill out the form with course details
4. Submit! We'll review and add it to the site

### For Developers (Direct Contribution)
If you're comfortable with Git and JSON, you can directly submit a Pull Request:

#### Step 1: Fork & Clone
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/Learning-Compass.git
cd Learning-Compass
```

#### Step 2: Create a Branch
```bash
git checkout -b add-course-name
```

#### Step 3: Add Your Course to `data.json`

Find the appropriate section and add your course following this format:

```json
{
  "name": "Course Name",
  "url": "https://course-url.com",
  "type": "Online Course",
  "description": "A brief 2-3 sentence description of what the course covers and why it's valuable.",
  "tags": ["Beginner", "Free", "Certificate", "Recommended"]
}
```

**Available Tags:**
- **Level:** `Beginner`, `Intermediate`, `Advanced`
- **Cost:** `Free`, `Paid`, `Free to Audit`, `Freemium`
- **Format:** `Video`, `Interactive`, `Book`, `Project-based`
- **Certification:** `Certificate`
- **Language:** `Hindi`, `English` (default)
- **Quality:** `Recommended` (for exceptional courses)
- **Topic-specific:** `Java`, `C Programming`, `Algorithms`, `AI`, `Web`, etc.

#### Step 4: Update Filter Tags (if needed)

If you're adding a **new category** or **programming language**, update `script.js`:

1. Add to `broadTags` array (line ~118)
2. Add mapping in `mapToBroadTags` function (line ~125)

Example:
```javascript
// In broadTags array:
'Python', 'JavaScript', 'Your-New-Tag'

// In mapToBroadTags function:
else if (["your-new-tag", "related-tag"].includes(t)) tagSet.add("Your-New-Tag");
```

#### Step 5: Test Locally
```bash
# Open index.html in a browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

Verify:
- ✅ Course appears in the correct section
- ✅ Filter tag works correctly
- ✅ Links open properly
- ✅ JSON is valid (no syntax errors)

#### Step 6: Commit & Push
```bash
git add data.json script.js
git commit -m "Add [Course Name] to [Section Name]"
git push origin add-course-name
```

#### Step 7: Create Pull Request
1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Describe what you added
4. Submit!

---

## 🐛 Report a Bug

Found an issue? [Open a Bug Report](https://github.com/SpitFiyah/Learning-Compass/issues/new?assignees=&labels=bug&template=bug-report.yml&title=%5BBUG%5D%3A+)

---

## 💡 Suggest an Improvement

Have an idea for a new feature? [Open a Feature Request](https://github.com/SpitFiyah/Learning-Compass/issues/new) and describe your idea!

---

## 📋 Quality Guidelines

When suggesting courses, please ensure:
- **Free resources preferred** (or clear pricing indicated)
- **High-quality content** from reputable sources
- **Active & maintained** (not outdated or abandoned)
- **Accessible** (working links, available globally when possible)
- **Clear descriptions** (help users understand what they'll learn)

---

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on helping learners
- Credit original authors and sources

---

## ❓ Questions?

Feel free to [open an issue](https://github.com/SpitFiyah/Learning-Compass/issues/new) or reach out to the maintainers!

**Thank you for helping make learning accessible to everyone!** 🚀
