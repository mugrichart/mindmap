# Design Document: Mind Map

This document outlines the visual identity and design system for the Mind Map application.

## 🎨 Creative Vision
Mind Map is a spatial intelligence layer for AI interaction. The design should feel **utilitarian, neutral, and high-fidelity**. It draws inspiration from "Tools for Thought" (Obsidian, Notion) and modern AI environments (Claude, ChatGPT) that prioritize content over brand color.

## 🌑 Visual Style: "Monochrome Intelligence"
- **Aesthetic**: A disciplined, near-monochromatic dark mode using neutral greys and deep blacks.
- **Key Concepts**: **Clarity through Contrast**. We use pure white and high-contrast greys to denote hierarchy rather than color.
- **Key Concepts**: **Clarity through Contrast**. We use pure white and high-contrast greys to denote hierarchy, creating atmospheric depth without using flat blacks.
- **Feedback**: Minimalist and precise. No glows, no gradients, no "purple problem".

## 🎨 Color Palette

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Foundation** | `#0D0D0F` | Deep Chat Background (Ink Black) |
| **Surface** | `#141416` | Sidebar and UI Layers (Subtle Contrast) |
| **High Contrast** | `#FAFAFA` | Primary UI Actions / Headings |
| **Neutral Slate** | `#71717A` | Secondary Text / Muted UI |
| **Deep Zinc** | `#27272A` | Borders / Subtle Overlays |

## 🖋️ Typography
- **Headings**: `Inter` (Semi-bold) - tight, professional.
- **Body**: `Inter` (Regular) - designed for neutral, high-readability interaction.
- **Mono**: `Geist Mono` - for topic paths and technical metadata.

## 🧩 Components
### Topics Map & Genealogy
- **Genealogy Trace**: A secondary navigation layer at the bottom of the sidebar. Muted opacity (`text-foreground/30`) with interactive breadcrumbs.
- **Topics Map**: A spatial visualization layer. High-contrast highlighting for the 'family line' (focus) and extreme dimming (`opacity-20`) for the peripheral knowledge branches.
- **Visual Hierarchy**: The Chat Interface is a few degrees darker than the Sidebar, creating atmospheric depth without using flat blacks.

### Buttons
- **Primary**: Solid White with black text. Instant, high-contrast recognition.
- **Secondary**: Deep Zinc surface with subtle border.
- **Ghost**: Pure text with Zinc-colored hover states.

### Cards & Nodes
- **Borders**: Precise 1px borders using Deep Zinc (`#27272A`).
- **Surface**: Subtle backdrop blurs (20px) with Zinc foundations.
- **Corner Radius**: 8px standard for a tighter, more technical feel.

## ✨ Interactions
- **Active State**: Inverting contrast (e.g., active node becomes High Contrast with dark text).
- **Spatial Mapping**: Transitions use 300ms-500ms durations for the Map overlay to give a sense of shifting intelligence layers.
- **Focus**: Clean 1px border shift to High Contrast white (no glow).
