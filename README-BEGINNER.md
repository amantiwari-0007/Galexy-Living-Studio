# Galaxy Living Studio — beginner guide

## Preview the website
1. Extract the ZIP file.
2. Open `Main/index.html` in a modern browser. For best results, use VS Code with the Live Server extension.
3. Open `contact.html` to try the full project enquiry form.

## File guide
- `index.html` — homepage layout, hero, featured collections, and short enquiry form.
- `about.html` — brand and studio information.
- `products.html` — product catalogue and filters.
- `product-detail.html` — reusable product details template.
- `projects.html` — inspiration/projects page.
- `contact.html` — detailed enquiry form.
- `style.css` — visual design, layout, responsive styles, button colors, form styling, and footer.
- `script.js` — shared navigation, homepage interactions, enquiry forms, WhatsApp panel, and copyright year.
- `product-detail.js` — fills the product details template.
- `projects.js` — interactions for the projects page.

## Form behaviour and an important limitation
The forms use built-in HTML validation plus JavaScript checks for phone number digit count. The contact form asks for name, phone, email (optional), location (optional), category, budget, timeline, and a detailed message. The homepage form asks for name, phone, interest, optional email, and optional details.

When a visitor submits a valid form, the website saves a copy to `localStorage` on that visitor's browser when browser storage is available, then opens WhatsApp with the message filled in. The visitor must press **Send** in WhatsApp to send it.

**This is not a backend.** Local storage is private to that browser and does not deliver the enquiry to the business. To receive enquiries reliably, connect a form service or backend before launching publicly. Never treat local storage as a business lead database.

## Updating business contact details
Search the project for `918882901005` and replace it with the correct WhatsApp/phone number in international format (digits only in `wa.me` URLs). Check all phone and WhatsApp links before publishing.

## Code comments
CSS comments explain the purpose of each new polish-layer selector and declaration. The enquiry-form JavaScript sections include beginner-oriented comments explaining validation, reading fields, local draft saving, message construction, and WhatsApp navigation. Existing legacy sections retain their original structure with additional section-level comments where modified.

## Launch checklist
- Confirm brand name and rights to use it.
- Confirm phone and WhatsApp number.
- Confirm product prices, descriptions, image rights, and availability.
- Connect a real form destination (email/form service/backend).
- Test keyboard focus, mobile layout, and all links on the deployed HTTPS website.

## Latest visual polish (October 2026)
The final section at the bottom of `style.css` is named **GALAXY LIVING STUDIO — FINAL VISUAL REFINEMENT**. It is deliberately kept together so a beginner can find the latest changes in one place:
- Header: bright ivory background, readable dark navigation, and a warm champagne Enquire button.
- Hero: a subtle dark gradient behind the heading and a darker translucent secondary button for contrast.
- Quick contact icons: a fixed, frosted-glass dock inspired by iPhone controls. It stays in place while the page scrolls and is not draggable.

To adjust the dock position, change `right` and `top` inside the final `.contact-dock` rule. To make the glass more or less transparent, change the alpha value in `background: rgba(246, 245, 240, 0.52)`; a smaller last number means more transparency. Keep the final override section at the bottom of `style.css` so these values take priority.


## Header and floating contact icons
- The header now matches the reference: Home, Collections, Mattresses, Curtains, About, and Inspiration. There is no Enquire button in the header.
- Call, Enquiry, and WhatsApp remain in the fixed glass-style contact dock on the upper-right side.
- To move the dock, find the final `FINAL REFINEMENT` section in `style.css` and change `top: 108px` or `right: 22px`. The mobile position is set in the nearby media query.
- CSS comments explain what each override changes. Keep the final refinement section at the bottom so these intentional overrides take priority over earlier styles.
