Fix two bugs on the Expenses page filter row:

## 1. Category filter showing UUID instead of category name
The category filter dropdown (currently showing "6396c8b7-befc-4c0..." instead of a category name like "Fuel" or "Food") is rendering the raw category id instead of looking up and displaying its name.

- Find the filter dropdown's selected-value display logic — it's likely using the raw value (category_id) directly as the label instead of finding the matching category object from the categories list and rendering its `name` field
- Fix: selectedCategory = categories.find(c => c.id === selectedCategoryId); render selectedCategory?.name ?? 'All categories', not the raw id
- Also check the dropdown's OPTION list itself, not just the selected-value display — confirm each option shows the category name with its emoji/icon (matching the pattern used elsewhere, e.g. the category selector in Add Expense), not just an id in the list too
- This same value/label mixup pattern is worth a quick check in any OTHER dropdown using category_id as a value — the month filter next to it looks correct (shows "July 2026", not a raw value), so use that as the reference for how selects should resolve display text

## 2. Filter row layout cut off / not fitting the screen
The "July 2026" and category filter dropdowns are sitting in a row that overflows past the right edge of the screen instead of fitting within the viewport or wrapping to a new line.

- On mobile (≤640px, consistent with the earlier mobile-card-layout breakpoint used for the history tables), stack the search input, month filter, and category filter into a single column instead of a horizontal row — full width each, stacked vertically with consistent gap spacing
- On tablet/desktop (≥641px), the horizontal row layout is fine, but confirm both dropdowns have a reasonable max-width (e.g. not allowed to grow wider than their content needs, and not forced wider than available space) so they don't push each other off-screen even at that breakpoint
- Audit for a fixed/hardcoded width on either dropdown — likely cause of the overflow, similar root cause to the earlier Balance/Expenses horizontal-scroll bug

Test specifically: select a category filter, confirm the label shows the actual category name (not a UUID), and confirm the whole filter row is fully visible and usable on a 375-412px wide viewport without any horizontal scroll or clipped elements.