# AWS Exam Practice

[![CI](https://github.com/jajera/aws-exam-practice/actions/workflows/ci.yml/badge.svg)](https://github.com/jajera/aws-exam-practice/actions/workflows/ci.yml)
[![Quality](https://github.com/jajera/aws-exam-practice/actions/workflows/quality.yml/badge.svg)](https://github.com/jajera/aws-exam-practice/actions/workflows/quality.yml)
[![Deploy](https://github.com/jajera/aws-exam-practice/actions/workflows/deploy.yml/badge.svg)](https://github.com/jajera/aws-exam-practice/actions/workflows/deploy.yml)

A modern, interactive quiz application for practicing AWS certification exams. Built
with React, TypeScript, and Tailwind CSS, hosted on GitHub Pages.

## Features

- **Interactive Quiz Interface**: Answer questions one at a time with immediate feedback
- **Per-Choice Explanations**: Learn from detailed explanations for each answer choice
- **Progress Tracking**: Visual progress bar and question navigation
- **Results Analysis**: Comprehensive score breakdown by exam domains
- **Persistent State**: Your progress is saved in localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Exam Support**: Easy to add new AWS certification exams

## Available Exams

- **AWS Certified Solutions Architect – Associate (SAA-C03)**
  - Design Secure Architectures (30%)
  - Design Resilient Architectures (26%)
  - Design High-Performing Architectures (24%)
  - Design Cost-Optimized Architectures (20%)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

- Clone the repository:

  ```bash
  git clone https://github.com/jajera/aws-exam-practice.git
  cd aws-exam-practice
  ```

- Install dependencies:

  ```bash
  npm install
  ```

  - Start the development server:

  ```bash
  npm run dev
  ```

  - Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

  ```bash
  npm run build
  ```

The built files will be in the `dist` directory, ready for deployment.

## Project Structure

  ```plaintext
  aws-exam-practice/
  ├── data/                   # JSON exam files
  │   └── saa-c03.json       # SAA-C03 exam questions
  ├── src/
  │   ├── components/        # React components
  │   │   ├── ExamSelector.tsx
  │   │   ├── QuestionCard.tsx
  │   │   ├── QuizInterface.tsx
  │   │   └── ResultsSummary.tsx
  │   ├── types/            # TypeScript interfaces
  │   │   └── exam.ts
  │   ├── App.tsx           # Main app component
  │   ├── main.tsx          # Entry point
  │   └── index.css         # Global styles
  ├── public/               # Static assets
  ├── .github/workflows/    # GitHub Actions
  └── README.md
  ```

## Adding New Exams

1. Create a new JSON file in the `data/` directory following the structure in `saa-c03.json`
2. Add the exam to the `availableExams` array in `ExamSelector.tsx`
3. The exam will automatically be available for selection

### Exam JSON Structure

  ```json
  {
    "examId": "exam-id",
    "title": "Exam Title",
    "summary": {
      "description": "Exam description",
      "domains": [
        {
          "name": "Domain Name",
          "percentage": 30,
          "subcategories": ["Subcategory 1", "Subcategory 2"]
        }
      ]
    },
    "questions": [
      {
        "id": 1,
        "question": "Question text?",
        "type": "multiple-choice",
        "domain": "Domain Name",
        "subcategory": "Subcategory 1",
        "choices": [
          {
            "label": "A",
            "text": "Choice text",
            "explanation": "Explanation text"
          }
        ],
        "answer": "A"
      }
    ]
  }
  ```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

- **CI** (`.github/workflows/ci.yml`): Runs tests, type checking, and builds on every
  push and PR
- **Quality** (`.github/workflows/quality.yml`): Performs code quality checks, coverage
  analysis, and accessibility testing
- **Deploy** (`.github/workflows/deploy.yml`): Automatically deploys to GitHub Pages
  on main branch pushes
- **Dependency Check** (`.github/workflows/dependency-check.yml`): Weekly check for
  dependency updates

### Quality Gates

- ✅ TypeScript compilation without errors
- ✅ All tests passing with 80%+ coverage
- ✅ No security vulnerabilities (moderate level)
- ✅ Build successful
- ✅ No console.log statements in production code
- ✅ Bundle size analysis

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to
the main branch. The deployment is handled by GitHub Actions.

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` directory to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-exam`
3. Add your exam data or improvements
4. Commit your changes: `git commit -m 'Add new exam'`
5. Push to the branch: `git push origin feature/new-exam`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Acknowledgments

- AWS for providing comprehensive certification programs
- React and TypeScript communities for excellent tooling
- Tailwind CSS for beautiful, utility-first styling
