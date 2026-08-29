import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

// Color Palette
const PRIMARY = [234, 88, 12];     // #ea580c Orange
const DARK = [15, 23, 42];         // #0f172a Slate 900
const TEXT_MAIN = [51, 65, 85];     // #334155 Slate 700
const TEXT_MUTED = [100, 116, 139];// #64748b Slate 500
const BG_LIGHT = [248, 250, 252];  // #f8fafc Slate 50
const BORDER = [226, 232, 240];    // #e2e8f0 Slate 200

let yPos = 25;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = 210 - MARGIN * 2; // 174mm

const addNewPage = () => {
  doc.addPage();
  yPos = 25;
};

const checkPageOverflow = (neededHeight = 15) => {
  if (yPos + neededHeight > PAGE_HEIGHT - 22) {
    addNewPage();
  }
};

const drawSectionTitle = (number, title) => {
  checkPageOverflow(18);
  yPos += 4;
  doc.setFillColor(...PRIMARY);
  doc.rect(MARGIN, yPos - 4.5, 3, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(...DARK);
  doc.text(`${number}. ${title}`, MARGIN + 6, yPos + 1);
  yPos += 8;
};

const drawSubTitle = (title) => {
  checkPageOverflow(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY);
  doc.text(title, MARGIN, yPos);
  yPos += 5.5;
};

const drawParagraph = (text, spacing = 5) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(...TEXT_MAIN);
  const splitText = doc.splitTextToSize(text, CONTENT_WIDTH);
  checkPageOverflow(splitText.length * 4.1 + spacing);
  doc.text(splitText, MARGIN, yPos);
  yPos += splitText.length * 4.1 + spacing;
};

const drawBullet = (boldPrefix, text, spacing = 3.5) => {
  doc.setFontSize(8.8);
  const prefix = `• ${boldPrefix}: `;
  const fullText = prefix + text;
  const split = doc.splitTextToSize(fullText, CONTENT_WIDTH - 4);
  checkPageOverflow(split.length * 4.1 + spacing);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text(`• ${boldPrefix}: `, MARGIN + 2, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MAIN);

  if (split.length === 1) {
    doc.text(text, MARGIN + 2 + doc.getTextWidth(`• ${boldPrefix}: `), yPos);
    yPos += 4.2 + spacing;
  } else {
    doc.text(doc.splitTextToSize(text, CONTENT_WIDTH - 6), MARGIN + 6, yPos + 4.1);
    yPos += split.length * 4.1 + spacing;
  }
};

const drawBox = (title, items) => {
  const boxHeight = 12 + items.length * 5.8;
  checkPageOverflow(boxHeight + 6);
  doc.setFillColor(...BG_LIGHT);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(MARGIN, yPos, CONTENT_WIDTH, boxHeight, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...PRIMARY);
  doc.text(title, MARGIN + 5, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.setTextColor(...TEXT_MAIN);
  let itemY = yPos + 11;
  items.forEach((item) => {
    doc.text(`- ${item}`, MARGIN + 6, itemY);
    itemY += 5.2;
  });

  yPos += boxHeight + 6;
};

// ==========================================
// 1. COVER / TITLE PAGE
// ==========================================
doc.setFillColor(...DARK);
doc.rect(0, 0, 210, 297, 'F');

doc.setFillColor(...PRIMARY);
doc.rect(20, 25, 30, 4, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(24);
doc.setTextColor(255, 255, 255);
doc.text('INTERNSHIP REPORT', 20, 45);

doc.setFontSize(15);
doc.setTextColor(251, 146, 60);
doc.text('ITETE BUNA & RESTAURANT PLATFORM', 20, 56);

doc.setFontSize(10.5);
doc.setTextColor(148, 163, 184);
doc.text('Digital QR Menu & Operations Platform • Physical to Digital Transition & Staff RBAC', 20, 65);

// Middle Card info
doc.setFillColor(30, 41, 59);
doc.roundedRect(20, 95, 170, 95, 4, 4, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(255, 255, 255);
doc.text('PROJECT & INTERNSHIP METADATA', 28, 108);

doc.setDrawColor(51, 65, 85);
doc.line(28, 112, 182, 112);

const metaData = [
  ['Candidate / Intern:', 'Software Engineering Intern'],
  ['Program of Study:', 'B.Sc. in Computer Science / Software Engineering'],
  ['Brand Identity:', 'ITETE BUNA (Authentic Single-Origin & Dining)'],
  ['Core Mission:', 'Physical to Digital QR Menu Migration & Staff RBAC'],
  ['Host Project:', 'Restaurant Menu QR Code Monorepo'],
  ['Tech Stack:', 'React 18, Vite 5, Tailwind CSS, Framer Motion, Axios'],
  ['Key Roles Supported:', 'Administrator (Full CRUD/Settings) vs. Waiter (Live Floor Ops)'],
];

let metaY = 120;
metaData.forEach(([label, val]) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(251, 146, 60);
  doc.text(label, 28, metaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(val, 72, metaY);
  metaY += 9;
});

doc.setFontSize(8.5);
doc.setTextColor(148, 163, 184);
doc.text('Confidential & Academic Final Project Submission', 20, 265);
doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 271);

// ==========================================
// 2. TABLE OF CONTENTS
// ==========================================
addNewPage();

doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.setTextColor(...DARK);
doc.text('Table of Contents', MARGIN, yPos);
yPos += 12;

const toc = [
  ['1. Executive Summary & Core Mission', 'Page 2'],
  ['2. Introduction: Transitioning Physical Menus to Digital', 'Page 2'],
  ['3. Company Background & Hospitality Tech Profile', 'Page 3'],
  ['4. Customer QR Menu Discovery & Ordering Experience', 'Page 3'],
  ['5. Admin & Waiter Operational Control (RBAC)', 'Page 4'],
  ['6. Technical Skills & Engineering Knowledge Utilized', 'Page 4'],
  ['7. Collaboration, Agile Processes & Teamwork', 'Page 5'],
  ['8. Project Highlights & Deep-Dive Case Studies', 'Page 5'],
  ['9. Challenges Faced, Root Cause Analysis & Solutions', 'Page 6'],
  ['10. Organizational Value Added, Handover & Conclusion', 'Page 6'],
];

toc.forEach(([title, pge]) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text(title, MARGIN + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text(pge, 180, yPos, { align: 'right' });
  doc.setDrawColor(241, 245, 249);
  doc.line(MARGIN + 2, yPos + 1.5, 180, yPos + 1.5);
  yPos += 7.5;
});

yPos += 8;

// ==========================================
// 3. EXECUTIVE SUMMARY & INTRODUCTION
// ==========================================
drawSectionTitle('1', 'Executive Summary & Core Mission');
drawParagraph(
  'The primary purpose of this project is the digital transformation of traditional restaurant operations: replacing physical paper menus with an interactive, mobile-first QR table ordering suite. When customers scan the table QR code, all restaurant offerings (food, hot/cold drinks, appetizers, desserts, daily specials) appear instantly with real-time stock availability. The platform equips administrators with full CRUD and hide/show controls, while granting waitstaff dedicated operational access.'
);

drawSectionTitle('2', 'Introduction: Transitioning Physical Menus to Digital');
drawSubTitle('2.1 Limitations of Physical Paper Menus');
drawParagraph(
  'Physical menus suffer from high reprinting costs, inability to reflect out-of-stock items, slow table turnarounds, and lack of dietary/allergen transparency. Whenever dishes or prices change, physical menus must be redesigned, printed, and laminated.'
);

drawSubTitle('2.2 Digital QR Solution & Academic Objectives');
drawParagraph(
  'This project solves these challenges by providing instant browser-based QR menus with live availability toggling, dietary filters, and direct kitchen order dispatching. The project reinforces computer science coursework in distributed web architecture, role-based security, state synchronization, and human-computer interaction.'
);

// ==========================================
// 4. COMPANY BACKGROUND & CUSTOMER EXPERIENCE
// ==========================================
addNewPage();
drawSectionTitle('3', 'Company Background & Hospitality Tech Profile');
drawParagraph(
  'The host organization develops Hospitality Technology (FoodTech) and SaaS products, delivering contactless dining menus, real-time Kitchen Display Systems (KDS), table management, and analytics to hospitality venues.'
);

drawSectionTitle('4', 'Customer QR Menu Discovery & Ordering Experience');
drawSubTitle('4.1 QR Scanning & Dynamic Table Routing');
drawParagraph(
  'Guests scan a physical table stand QR code with their smartphone camera. The scanner immediately routes to the table menu (/menu/qr/:shortId) linking the table name (e.g. Table 3 Patio) without requiring user login or app installation.'
);

drawSubTitle('4.2 Comprehensive Food & Beverage Catalog');
drawBullet('Full Menu Visibility', 'Displays all food, drinks, desserts, and specials organized by clear category tabs.');
drawBullet('Dietary & Allergen Filtering', 'One-touch filter pills for Vegetarian (Veg), Vegan, Gluten-Free (GF), Halal, and Spicy levels.');
drawBullet('Interactive Cart Drawer', 'Guests customize quantities, attach special kitchen notes (e.g. no onions), and submit orders.');
drawBullet('Table Service Actions', 'Floating action pill with instant "Call Waiter" and "Request Bill" (Card / Cash) alerts.');
drawBullet('Guest Wi-Fi & Language Switcher', 'One-tap guest Wi-Fi password copy and English / Amharic / French / Spanish translation.');

// ==========================================
// 5. ADMIN & WAITER OPERATIONAL CONTROL (RBAC)
// ==========================================
addNewPage();
drawSectionTitle('5', 'Admin & Waiter Operational Control (RBAC)');

drawSubTitle('5.1 Full Admin Control: Add, Edit, Delete, and Hide/Show (Stock Toggle)');
drawBullet('Add & Edit Dishes', 'Admins can upload multiple dish images, configure prices, discount rates, spicy levels, and cooking times.');
drawBullet('Instant Hide/Show (Stock Control)', 'Single-click switch on MenuCard toggles items between Active (In-Stock) and Hidden (Out-of-Stock). Hidden items disappear from customer menus immediately.');
drawBullet('Permanent Deletion', 'Safely remove discontinued items and categories with confirmation safeguards.');

drawSubTitle('5.2 Role-Based Access: Admin vs. Waiter / Staff Roles');
drawBox('Role-Based Capabilities Matrix', [
  'Admin / Manager Role: Full control over Menu CRUD, Branding Settings, Currencies, Tax/Service fees, and Analytics.',
  'Waiter / Staff Role: Dedicated access to Live Orders queue, Waiter Call notifications, Bill Requests, and Stock Toggles.',
]);

drawSubTitle('5.3 Live Kitchen Display & Printable Table Stands');
drawParagraph(
  'Orders dispatched by guests appear in real time on the Live Kitchen Queue (/dashboard/orders) with Kanban status progression (Pending -> In Kitchen -> Ready -> Served). The QR Manager (/dashboard/qr) generates print-ready A5 PDF acrylic table stands with high-res QR codes and Wi-Fi credentials.'
);

// ==========================================
// 6. TECHNICAL SKILLS & COLLABORATION
// ==========================================
drawSectionTitle('6', 'Technical Skills & Engineering Knowledge Utilized');
drawBullet('Frontend Architecture', 'React 18, Vite 5, Tailwind CSS 3, Framer Motion 10, JavaScript ES6+.');
drawBullet('Data Transport & State', 'Axios with JWT interceptors, React Context API, and cross-tab storage broadcasting.');
drawBullet('Document Generation', 'jsPDF and html2canvas for vector A5 acrylic table stand generation.');
drawBullet('Agile & Version Control', 'Git, GitHub feature branches, pull requests, semantic commits, and sprint retrospectives.');

// ==========================================
// 7. PROJECT HIGHLIGHTS & CASE STUDIES
// ==========================================
addNewPage();
drawSectionTitle('7', 'Collaboration, Agile Processes & Teamwork');
drawParagraph(
  'Collaborated in a 2-week Agile Scrum cadence with daily standups, code reviews, and cross-functional design handoffs. Ensured zero build regressions and maintained 100% clean production compilations across all workspaces.'
);

drawSectionTitle('8', 'Project Highlights & Key Case Studies');

drawSubTitle('Case Study 1: Real-Time Table Ordering & Live Kitchen Queue');
drawParagraph(
  'Problem: Paper menus cause order errors, miscommunicated dietary requests, and billing bottlenecks. Solution: Built an end-to-end table ordering pipeline with an animated cart drawer, live status progression, and instant table assistance banner alerts.'
);

drawSubTitle('Case Study 2: White-Label Customizer & Acrylic Table Stand PDF Generator');
drawParagraph(
  'Problem: Restaurants need custom branding and physical acrylic QR table tents. Solution: Built a Settings panel (/dashboard/settings) supporting 7 theme palettes, multi-currency formatting (ETB, $, EUR, GBP), and an automated single-click A5 PDF table tent export.'
);

// ==========================================
// 8. CHALLENGES & CONCLUSION
// ==========================================
addNewPage();
drawSectionTitle('9', 'Challenges Faced, Root Cause Analysis & Solutions');
drawBullet(
  'Vite 5 / Node Toolchain Alignment',
  'Resolved alpha dependency native binding issues by standardizing all workspaces to stable Vite 5 and npm workspace scripts.'
);
drawBullet(
  'Cross-Tab Reactive Sync',
  'Employed window storage listeners and custom dispatch events to broadcast stock updates and new orders across open tabs in real time.'
);
drawBullet(
  'High-DPI PDF QR Printing',
  'Configured html2canvas with 3x scale multiplier and high error correction in qrcode.react for sharp table tent printouts.'
);

drawSectionTitle('10', 'Organizational Value Added, Handover & Conclusion');
drawParagraph(
  'The digital QR menu system successfully eliminates paper menu reprinting expenses, increases table turnover velocity, and equips both managers and waiters with a robust operational toolset.'
);

drawBox('Summary of Project Deliverables', [
  'Full Monorepo Codebase: Clean React 18 / Vite source code in apps/admin, apps/customer, and packages/shared.',
  'Digital Menu Catalog: High-speed mobile-first menu displaying all food, drink, and dessert categories.',
  'Admin Control Suite: Comprehensive Add, Edit, Delete, and In-Stock Hide/Show toggle tools.',
  'Waiter Operational View: Live Kitchen Display Kanban, table service alerts, and status pipelines.',
  'Complete Documentation: Formatted README.md, INTERNSHIP_REPORT.md, and Project_Documentation.pdf.',
]);

// ==========================================
// RUNNING HEADERS & FOOTERS (PAGES 2+)
// ==========================================
const totalPages = doc.internal.getNumberOfPages();
for (let i = 2; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Restaurant QR Menu & Operations Platform • Physical to Digital Transition & Staff RBAC', MARGIN, 12);
  doc.setDrawColor(...BORDER);
  doc.line(MARGIN, 14, 210 - MARGIN, 14);

  doc.line(MARGIN, 283, 210 - MARGIN, 283);
  doc.text('Confidential - Academic & Operational Project Documentation', MARGIN, 288);
  doc.text(`Page ${i} of ${totalPages}`, 210 - MARGIN, 288, { align: 'right' });
}

const outputPath = path.resolve(__dirname, 'Project_Documentation.pdf');
const pdfData = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfData));
console.log('Updated Comprehensive Internship Report PDF generated at:', outputPath);
