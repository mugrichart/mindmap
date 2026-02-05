# Design Document: Mind Map

This document outlines the visual identity and design system for the Mind Map application.

## 🎨 Creative Vision
Mind Map is a spatial intelligence layer for AI interaction. The design should feel **utilitarian, neutral, and high-fidelity**. It draws inspiration from "Tools for Thought" (Obsidian, Notion) and modern AI environments (Claude, ChatGPT) that prioritize content over brand color.

## 🌑 Visual Style: "Monochrome Intelligence"
- **Aesthetic**: A disciplined, near-monochromatic dark mode using neutral greys and deep blacks.
- **Key Concepts**: **Clarity through Contrast**. We use pure white and high-contrast greys to denote hierarchy rather than color.
- **Feedback**: Minimalist and precise. No glows, no gradients, no "purple problem".

## 🎨 Color Palette

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Foundation** | `#09090B` | Deep Page Background |
| **Surface** | `#18181B` | Sidebars, Cards, and UI Layers |
| **High Contrast** | `#FAFAFA` | Primary UI Actions / Headings |
| **Neutral Slate** | `#71717A` | Secondary Text / Muted UI |
| **Deep Zinc** | `#27272A` | Borders / Subtle Overlays |

## 🖋️ Typography
- **Headings**: `Inter` (Semi-bold) - tight, professional.
- **Body**: `Inter` (Regular) - designed for neutral, high-readability interaction.
- **Mono**: `Geist Mono` - for topic paths and technical metadata.

## 🧩 Components
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
- **Transitions**: 150ms-200ms duration. Snap-to-target for a feel of high-performance efficiency.
- **Focus**: Clean 1px border shift to High Contrast white (no glow).
