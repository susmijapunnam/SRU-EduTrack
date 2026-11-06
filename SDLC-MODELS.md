# SDLC Models for SRU EduTrack

## Project overview

SRU EduTrack is a browser-based student-management and academic-tracking application. Its current interface includes a dashboard, student directory, academic marks, attendance, analytics, reports, search, and selectable themes. The current implementation is a front-end application that stores data in the browser's `localStorage`.

This document compares four SDLC models that can guide the project's development. These are alternative ways to organize the lifecycle, not four separate models to run simultaneously. The recommended approach is Agile development in short iterations, supported by iterative prototyping and risk-focused checks.

## Comparison

| Model | How it works | Suitability for EduTrack |
|---|---|---|
| **Agile** | Develop and deliver small increments, gather feedback, and reprioritize a backlog regularly. | **High.** Dashboard, student records, marks, attendance, and reports can be delivered and reviewed in separate increments. Feedback can shape usability and workflow improvements. |
| **Iterative** | Build an initial working version, then refine it through repeated cycles of planning, implementation, and evaluation. | **High.** The app can start with student records and progressively improve validation, analytics, accessibility, and persistence. It complements Agile but is not itself a team framework. |
| **V-Model** | Define verification and validation activities alongside each development stage; test each requirement against its corresponding implementation. | **Medium.** Useful for reliable grades, attendance calculations, data validation, and report outputs. It provides stronger test traceability but can be less flexible when requirements change. |
| **Waterfall** | Complete requirements, design, implementation, testing, and release largely in sequence. | **Low to medium.** It may suit a fixed-scope academic submission with stable requirements, but is less suitable if student or staff feedback is expected to change features during development. |

## Recommended approach

Use **Agile as the primary model**, organizing development into short, reviewable iterations. Use **iterative delivery** to improve each feature over time, and apply **V-Model-style test planning** to important data and calculation requirements. Waterfall is best reserved for documenting an agreed, fixed release scope.

## Example Agile iterations

### Iteration 1: Core student directory

- Confirm the student fields, search behavior, and add/edit/delete workflows.
- Implement and review the directory and student-record forms.
- Test searching, required fields, duplicate or invalid values, and record deletion.
- Demonstrate the increment and prioritize feedback.

### Iteration 2: Academics and attendance

- Agree on marks, grading, attendance statuses, and calculation rules.
- Implement marks entry, attendance tracking, and student-level summaries.
- Test boundaries, missing records, percentages, and updates to existing data.
- Review the workflows with representative users and refine them.

### Iteration 3: Dashboard, analytics, and reports

- Confirm the dashboard indicators, risk thresholds, and report contents.
- Implement analytics and reporting based on the stored student data.
- Check calculations against known sample data and verify empty-data cases.
- Review the usefulness and clarity of the results.

### Iteration 4: Quality and release readiness

- Address prioritized usability, accessibility, and responsive-layout feedback.
- Test persistence across reloads, invalid input handling, and key end-to-end flows.
- Document limitations, prepare release notes, and agree on follow-up improvements.

## Quality and testing practices

For each iteration, maintain acceptance criteria and test cases before considering a feature complete. At minimum:

- **Unit checks:** grade bands, percentages, attendance totals, and risk thresholds.
- **Feature checks:** student create/edit/delete, marks entry, attendance updates, search, and reports.
- **Validation checks:** empty values, invalid numbers, unsupported ranges, and missing records.
- **Regression checks:** confirm existing features still work after each increment.
- **Usability checks:** keyboard access, readable feedback, responsive layout, and understandable labels.
- **Data checks:** verify that browser storage behaves as expected and explain that `localStorage` is device/browser-specific; it is not a shared or server-backed database.

## Definition of done

An increment is ready for review when its agreed acceptance criteria pass, input and boundary cases are tested, existing core workflows remain functional, and known limitations are documented. A release is ready when the team has reviewed the integrated application and agreed on any remaining issues.
