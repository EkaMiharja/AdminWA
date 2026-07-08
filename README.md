# AdminWA

## Description

AdminWA is a WhatsApp automation bot built with **Node.js** and **whatsapp-web.js**. This project was developed as a learning and development platform to explore WhatsApp automation, media processing, artificial intelligence integration, and third-party API implementation.

The source code is intended for educational purposes, experimentation, and further feature development. It can also serve as a reference for developers who want to build their own WhatsApp automation system.

---

# Features

- WhatsApp Sticker Generator
- Quote Sticker Generator
- PDF to Image Converter
- OCR (Image to Text)
- Screenshot Sticker Generator
- Google Translate
- Pinterest Image Downloader
- TikTok Video Downloader
- Background Removal
- Delete Bot Messages
- Kick Group Member
- Tag All Members
- Group Information
- Poll Creator
- AI Chat (Google Gemini)
- Wallpaper Search
- System Information
- Interactive Menu

---

# Functions

- Automate WhatsApp message handling.
- Process images into stickers.
- Generate quote stickers.
- Convert PDF documents into images.
- Extract text from images using OCR.
- Translate text into multiple languages.
- Download TikTok videos without watermark.
- Search and send wallpapers.
- Download Pinterest images.
- Remove image backgrounds automatically.
- Manage WhatsApp groups.
- Generate polls.
- Interact with Google Gemini AI.
- Display server and bot system information.

---

# Dependencies

| Package | Purpose |
|---------|----------|
| whatsapp-web.js | WhatsApp Web API |
| @google/genai | Google Gemini AI |
| axios | HTTP Requests |
| canvas | Image Processing |
| dotenv | Environment Variables |
| fs-extra | File Management |
| pdf-lib | PDF Processing |
| qrcode-terminal | QR Login |
| tesseract.js | OCR Engine |
| @vitalets/google-translate-api | Translation |
| @imgly/background-removal-node | Background Removal |

---

# Feature Explanation

## Sticker

Convert images into WhatsApp stickers.

---

## Quote Sticker

Generate quote stickers from replied messages.

---

## PDF

Convert PDF files into images.

---

## OCR

Extract text from an image using OCR.

---

## Screenshot Sticker

Create meme-style screenshot stickers with embedded text.

---

## Translate

Translate text into another language using Google Translate.

---

## Pinterest

Search and download images from Pinterest.

---

## TikTok

Download TikTok videos without watermark.

---

## Remove Background

Automatically remove the background from an image.

---

## Delete

Delete messages sent by the bot.

---

## Kick

Remove members from a WhatsApp group.

---

## Tag All

Mention every member in a WhatsApp group.

---

## Group Information

Display detailed information about the current WhatsApp group.

---

## Poll

Create WhatsApp polls.

---

## AI

Interact with Google Gemini AI.

---

## Wallpaper

Search wallpapers based on keywords.

---

## System

Display bot status and system information.

---

## Menu

Display all available commands.

---

# Commands

| Command | Description |
|----------|-------------|
| !menu | Show available commands |
| !help | Show feature descriptions |
| !sticker | Convert image to sticker |
| !qc | Create quote sticker |
| !pdf | Convert PDF to images |
| !ocr | Extract text from image |
| !scap | Create screenshot sticker |
| !tr | Translate text |
| !pins | Search Pinterest images |
| !tt | Download TikTok video |
| !removebg | Remove image background |
| !delete | Delete bot message |
| !kick | Remove group member |
| !tagall | Mention all group members |
| !groupinfo | Display group information |
| !poll | Create a poll |
| !ai | Ask Google Gemini |
| !wallpaper | Search wallpapers |
| !system | Display system information |

---

# Installation

Clone this repository.

```bash
git clone https://github.com/yourusername/AdminWA.git
```

Go to the project directory.

```bash
cd AdminWA
```

Install dependencies.

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root before running the bot.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Add any additional environment variables required by your implementation.

---

# Running the Bot

For local development:

```bash
npm start
```

or

```bash
node index.js
```

If using Docker:

```bash
docker compose up -d --build
```

---

# Requirements

- Node.js 22 or later
- Google Gemini API Key
- WhatsApp Account
- Internet Connection

For Docker:

- Docker
- Docker Compose

---

# Project Structure

```
AdminWA
│
├── commands/
├── services/
├── config/
├── utils/
├── temp/
├── logs/
├── .env
├── package.json
├── index.js
├── Dockerfile
└── docker-compose.yml
```

---

# Disclaimer

This project is provided for educational, research, and development purposes only. Users are responsible for complying with WhatsApp's Terms of Service and all applicable laws when using this software.
