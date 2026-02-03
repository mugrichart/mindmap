# Design Document: Mind Map

This document outlines the visual identity and design system for the Mind Map application.

## 🎨 Creative Vision
Mind Map is about "Hierarchical Learning" and "Graph-based Chatting". The design should feel **infinite, interconnected, and intellectual**. It should give the user a sense of clarity amidst complex information.

## 🌑 Visual Style: "The Dark Node"
- **Aesthetic**: Modern, sleek, and premium dark mode.
- **Key Concepts**: **Left-to-right flow** (similar to folder structures), integrated node linking (like design tools), glassmorphism, and smooth transitions.
- **Typography**: Clean, geometric sans-serif fonts to maintain readability in dense maps.

## 🎨 Color Palette

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Deep Space** | `#050505` | Primary Background |
| **Midnight** | `#0A0A0A` | Secondary Background / Cards |
| **Electric Blue** | `#3B82F6` | Primary Accent / Links / Active Nodes |
| **Cyber Gold** | `#F59E0B` | Secondary Accent / Highlights |
| **Muted Silver** | `#94A3B8` | Primary Text |
| **Pure White** | `#FFFFFF` | Headings / Key Information |

## 🖋️ Typography
- **Headings**: `Outfit` or `Inter` (Bold/Semi-bold)
- **Body**: `Inter` (Regular/Medium)
- **Mono**: `Geist Mono` or `Fira Code` (for technical details/node IDs)

## 🧩 Components
### Buttons
- **Primary**: Solid Electric Blue with a subtle outer glow.
- **Secondary**: Outlined Midnight with white text, high border-radius (full).
- **Glass**: Semi-transparent Midnight with backdrop-blur.

### Cards & Nodes
- **Edges**: Thin, semi-transparent lines (#FFFFFF20).
- **Surface**: Background blur (20px), low opacity Midnight (#0A0A0A80).
- **Shadows**: Soft, deep shadows to create depth.

## ✨ Interactions
- **Hover**: Subtle scaling (1.02x) and increased glow on nodes.
- **Transitions**: Ease-in-out for all state changes (300ms).
- **Motion**: Parallax effects on the background grid to imply depth.
