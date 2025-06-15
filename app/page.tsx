"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Download, Highlighter, Palette, Type, Layout, FileText, Bold, Eye, EyeOff, Copy, Check } from "lucide-react"
import { domToPng, domToBlob } from "modern-screenshot"
import { marked } from "marked"

const FONT_FAMILIES = {
  // Sans-serif fonts
  Inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  "Eudoxus Sans": '"Eudoxus Sans", "Eudoxus Sans Bold", -apple-system, BlinkMacSystemFont, sans-serif',
  "SF Pro Display": '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  "Helvetica Neue": '"Helvetica Neue", Helvetica, Arial, sans-serif',
  Avenir: '"Avenir Next", Avenir, sans-serif',
  Circular: '"Circular", -apple-system, BlinkMacSystemFont, sans-serif',
  Poppins: '"Poppins", sans-serif',
  Montserrat: '"Montserrat", sans-serif',
  "Source Sans Pro": '"Source Sans Pro", sans-serif',
  Roboto: '"Roboto", sans-serif',
  "Open Sans": '"Open Sans", sans-serif',
  Lato: '"Lato", sans-serif',
  // Serif fonts for essays
  Georgia: 'Georgia, serif',
  "Times New Roman": '"Times New Roman", Times, serif',
  Garamond: 'Garamond, "EB Garamond", serif',
  "Playfair Display": '"Playfair Display", Georgia, serif',
  Merriweather: '"Merriweather", Georgia, serif',
  Lora: '"Lora", Georgia, serif',
  "Crimson Text": '"Crimson Text", Georgia, serif',
  // Modern aesthetic fonts
  "DM Sans": '"DM Sans", sans-serif',
  "Outfit": '"Outfit", sans-serif',
  "Manrope": '"Manrope", sans-serif',
  "Sora": '"Sora", sans-serif',
  "Space Grotesk": '"Space Grotesk", sans-serif',
  "Karla": '"Karla", sans-serif',
  "Libre Baskerville": '"Libre Baskerville", Georgia, serif',
  "Cormorant Garamond": '"Cormorant Garamond", Garamond, serif',
}

const PRESETS = {
  "Twitter Post": {
    width: 600,
    padding: 32,
    fontSize: 18,
    lineHeight: 1.4,
    bgColor: "#ffffff",
    textColor: "#1c1917",
    highlightColor: "#fef08a",
    fontFamily: "Inter",
    headerFontFamily: "Inter",
  },
  "Instagram Story": {
    width: 400,
    padding: 40,
    fontSize: 20,
    lineHeight: 1.3,
    bgColor: "#f8fafc",
    textColor: "#0f172a",
    highlightColor: "#fbbf24",
    fontFamily: "Poppins",
    headerFontFamily: "Montserrat",
  },
  "LinkedIn Post": {
    width: 672,
    padding: 48,
    fontSize: 16,
    lineHeight: 1.6,
    bgColor: "#ffffff",
    textColor: "#374151",
    highlightColor: "#ddd6fe",
    fontFamily: "SF Pro Display",
    headerFontFamily: "SF Pro Display",
  },
  "Blog Header": {
    width: 800,
    padding: 64,
    fontSize: 24,
    lineHeight: 1.5,
    bgColor: "#fafafa",
    textColor: "#111827",
    highlightColor: "#fed7aa",
    fontFamily: "Eudoxus Sans",
    headerFontFamily: "Eudoxus Sans",
  },
  Minimal: {
    width: 500,
    padding: 24,
    fontSize: 14,
    lineHeight: 1.5,
    bgColor: "#ffffff",
    textColor: "#525252",
    highlightColor: "#fde68a",
    fontFamily: "Helvetica Neue",
    headerFontFamily: "Helvetica Neue",
  },
  // New aesthetic presets
  "Literary Essay": {
    width: 700,
    padding: 56,
    fontSize: 18,
    lineHeight: 1.8,
    bgColor: "#faf8f5",
    textColor: "#2c2c2c",
    highlightColor: "#f0e6d2",
    fontFamily: "Lora",
    headerFontFamily: "Playfair Display",
  },
  "Academic Paper": {
    width: 650,
    padding: 48,
    fontSize: 16,
    lineHeight: 1.7,
    bgColor: "#ffffff",
    textColor: "#1a1a1a",
    highlightColor: "#e8f4fd",
    fontFamily: "Merriweather",
    headerFontFamily: "Crimson Text",
  },
  "Poetry": {
    width: 480,
    padding: 64,
    fontSize: 20,
    lineHeight: 1.9,
    bgColor: "#f5f3f0",
    textColor: "#3a3a3a",
    highlightColor: "#f5e1d3",
    fontFamily: "Cormorant Garamond",
    headerFontFamily: "Libre Baskerville",
  },
  "Modern Blog": {
    width: 680,
    padding: 40,
    fontSize: 17,
    lineHeight: 1.65,
    bgColor: "#fafafa",
    textColor: "#1f2937",
    highlightColor: "#c7d2fe",
    fontFamily: "DM Sans",
    headerFontFamily: "Outfit",
  },
  "Startup Pitch": {
    width: 600,
    padding: 36,
    fontSize: 16,
    lineHeight: 1.55,
    bgColor: "#0a0a0a",
    textColor: "#fafafa",
    highlightColor: "#3b82f6",
    fontFamily: "Manrope",
    headerFontFamily: "Space Grotesk",
  },
  "Newsletter": {
    width: 560,
    padding: 32,
    fontSize: 15,
    lineHeight: 1.6,
    bgColor: "#f8f7ff",
    textColor: "#2d3748",
    highlightColor: "#b794f4",
    fontFamily: "Karla",
    headerFontFamily: "Sora",
  },
  "Quote Card": {
    width: 500,
    padding: 48,
    fontSize: 22,
    lineHeight: 1.6,
    bgColor: "#1e293b",
    textColor: "#f1f5f9",
    highlightColor: "#fbbf24",
    fontFamily: "Georgia",
    headerFontFamily: "Playfair Display",
  },
  "Philosophy": {
    width: 620,
    padding: 52,
    fontSize: 19,
    lineHeight: 1.75,
    bgColor: "#fcfbf8",
    textColor: "#2b2b2b",
    highlightColor: "#d4a574",
    fontFamily: "Crimson Text",
    headerFontFamily: "Cormorant Garamond",
  },
  "Tech Article": {
    width: 720,
    padding: 44,
    fontSize: 16,
    lineHeight: 1.6,
    bgColor: "#0f172a",
    textColor: "#e2e8f0",
    highlightColor: "#22d3ee",
    fontFamily: "Inter",
    headerFontFamily: "Space Grotesk",
  },
  "Notion Style": {
    width: 640,
    padding: 36,
    fontSize: 16,
    lineHeight: 1.5,
    bgColor: "#ffffff",
    textColor: "#37352f",
    highlightColor: "#fdecc8",
    fontFamily: "Inter",
    headerFontFamily: "Inter",
  },
}

export default function HighlightEditor() {
  const [content, setContent] = useState<string>(`# On the Nature of Creativity

## The Paradox of Constraint

The most profound creative breakthroughs often emerge not from ===limitless freedom, but from embracing constraints===. When we restrict our options, we force our minds to explore deeper within narrower boundaries.

**Consider the haiku:** seventeen syllables that can capture the entire universe. Or the sonnet: fourteen lines that have expressed humanity's deepest loves and losses for centuries.

## The Architecture of Ideas

Ideas are not born in isolation. They are ===constructed from the collision of existing thoughts===, experiences, and observations. The creative mind is less an inventor than an architect, assembling pre-existing materials into new configurations.

> "Creativity is just connecting things. When you ask creative people how they did something, they feel a little guilty because they didn't really do it, they just saw something."  
> — Steve Jobs

## The Myth of the Eureka Moment

We romanticize the flash of insight, the sudden revelation. But ===creativity is a process, not an event===. It's the slow accumulation of observations, the patient refinement of ideas, the disciplined practice of craft.

**The truth is more mundane—and more achievable:**
1. Show up consistently
2. Pay attention to the world
3. Connect disparate ideas
4. Refine relentlessly

## Embracing the Unknown

Perhaps the greatest creative challenge is learning to be comfortable with uncertainty. The path from conception to completion is rarely linear. It meanders, doubles back, and sometimes leads to unexpected destinations.

But therein lies the magic: ===in surrendering to the process, we often discover something far more interesting than what we initially sought===.`)

  const [isMarkdown, setIsMarkdown] = useState<boolean>(true)
  const [fontSize, setFontSize] = useState<number>(16)
  const [lineHeight, setLineHeight] = useState<number>(1.5)
  const [bgColor, setBgColor] = useState<string>("#ffffff")
  const [textColor, setTextColor] = useState<string>("#1c1917")
  const [highlightColor, setHighlightColor] = useState<string>("#fef08a")
  const [width, setWidth] = useState<number>(672)
  const [padding, setPadding] = useState<number>(32)
  const [fontFamily, setFontFamily] = useState<string>("Inter")
  const [headerFontFamily, setHeaderFontFamily] = useState<string>("Inter")
  const [previewOnly, setPreviewOnly] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  
  // Undo/Redo history
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const renderRef = useRef<HTMLDivElement>(null)
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add to history when content changes (for undo/redo)
  const addToHistory = (newContent: string) => {
    // Remove any history after current index
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newContent)
    
    // Keep only last 50 items
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Initialize history with initial content
  useEffect(() => {
    if (history.length === 0) {
      setHistory([content])
      setHistoryIndex(0)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "h") {
        e.preventDefault()
        handleHighlight()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        handleBold()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [content, history, historyIndex])

  const applyPreset = (presetName: string) => {
    const preset = PRESETS[presetName as keyof typeof PRESETS]
    if (preset) {
      setWidth(preset.width)
      setPadding(preset.padding)
      setFontSize(preset.fontSize)
      setLineHeight(preset.lineHeight)
      setBgColor(preset.bgColor)
      setTextColor(preset.textColor)
      setHighlightColor(preset.highlightColor)
      setFontFamily(preset.fontFamily)
      setHeaderFontFamily(preset.headerFontFamily)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setContent(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setContent(history[newIndex])
    }
  }

  const handleHighlight = () => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    if (!selectedText) return

    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    let highlightedText
    if (isMarkdown) {
      highlightedText = `===${selectedText}===`
    } else {
      highlightedText = `<mark style="background-color: ${highlightColor}; padding: 0 4px;">${selectedText}</mark>`
    }

    const newContent = beforeText + highlightedText + afterText
    setContent(newContent)
    addToHistory(newContent)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + highlightedText.length, start + highlightedText.length)
    }, 0)
  }

  const handleBold = () => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    if (!selectedText) return

    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    let boldText
    if (isMarkdown) {
      boldText = `**${selectedText}**`
    } else {
      boldText = `<strong>${selectedText}</strong>`
    }

    const newContent = beforeText + boldText + afterText
    setContent(newContent)
    addToHistory(newContent)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + boldText.length, start + boldText.length)
    }, 0)
  }

  const processContent = (text: string) => {
    // First, convert literal \n to actual newlines
    let processedText = text.replace(/\\n/g, '\n')
    
    if (isMarkdown) {
      // Process custom highlight syntax first
      let processed = processedText.replace(
        /===(.*?)===/g,
        `<mark style="background-color: ${highlightColor};">$1</mark>`,
      )

      // Convert markdown to HTML with proper breaks option
      try {
        marked.setOptions({
          breaks: true, // This makes marked respect single line breaks
          gfm: true,    // GitHub Flavored Markdown
          pedantic: false,
        })
        processed = marked(processed) as string
        
        // Apply header font family to h1-h6 tags
        const headerFont = FONT_FAMILIES[headerFontFamily as keyof typeof FONT_FAMILIES]
        processed = processed.replace(/<h([1-6])>/g, `<h$1 style="font-family: ${headerFont};">`)
        
        // Apply header font family to strong/bold tags (use global flag to replace all occurrences)
        processed = processed.replace(/<strong>/g, `<strong style="font-family: ${headerFont};">`)
        
        // Ensure empty lines create visible spacing
        processed = processed.replace(/<\/p>\s*<p>/g, '</p><p style="margin-top: 1em;">')
        processed = processed.replace(/<br>\s*<br>/g, '<br><div style="height: 1em;"></div>')
        
        // Add some default styling to lists for better spacing
        processed = processed.replace(/<ul>/g, '<ul style="margin: 0.5em 0; padding-left: 2em; list-style-position: outside;">')
        // Preserve start attribute for ordered lists
        processed = processed.replace(/<ol(\s+start=["']?\d+["']?)?>/g, '<ol$1 style="margin: 0.5em 0; padding-left: 2em; list-style-position: outside; list-style-type: decimal;">')
        processed = processed.replace(/<li>/g, '<li style="margin: 0.25em 0;">')
      } catch (error) {
        console.error("Markdown parsing error:", error)
        processed = processedText.replace(/\n\n/g, '<br><div style="height: 1em;"></div>').replace(/\n/g, "<br>")
      }

      return processed
    } else {
      // For non-markdown, replace double newlines with spacing, single newlines with br
      let processed = processedText.replace(/\n\n/g, '<br><div style="height: 1em;"></div>').replace(/\n/g, "<br>")
      
      // Apply header font family to strong tags in HTML mode
      const headerFont = FONT_FAMILIES[headerFontFamily as keyof typeof FONT_FAMILIES]
      processed = processed.replace(/<strong>/g, `<strong style="font-family: ${headerFont};">`)
      
      return processed
    }
  }

  const handleExport = async (action: 'copy' | 'download' = 'copy') => {
    if (!renderRef.current) return

    try {
      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // modern-screenshot options for better quality
      const options = {
        quality: 0.95,
        scale: 2,
        backgroundColor: bgColor,
        style: {
          borderRadius: '0',
          boxShadow: 'none',
        }
      }

      if (action === 'copy') {
        // Generate blob for clipboard
        const blob = await domToBlob(renderRef.current, options)
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ])
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          } catch (err) {
            console.error("Failed to copy image to clipboard:", err)
            // Fallback to download if copy fails
            handleExport('download')
          }
        }
      } else {
        // Download
        const dataUrl = await domToPng(renderRef.current, options)
        const link = document.createElement("a")
        link.download = "highlighted-text.png"
        link.href = dataUrl
        link.click()
      }
    } catch (error) {
      console.error("Error exporting image:", error)
      alert("Failed to export image. Please check the console for details.")
    }
  }

  if (previewOnly) {
    return (
      <div className="min-h-screen bg-stone-100 p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
          
          @font-face {
            font-family: 'Eudoxus Sans';
            src: url('https://fonts.cdnfonts.com/s/19990/EudoxusSans-Regular.woff') format('woff');
            font-weight: 400;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Eudoxus Sans Bold';
            src: url('https://fonts.cdnfonts.com/s/19990/EudoxusSans-Bold.woff') format('woff');
            font-weight: 700;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Eudoxus Sans';
            src: url('https://fonts.cdnfonts.com/s/19990/EudoxusSans-Bold.woff') format('woff');
            font-weight: 700;
            font-style: normal;
          }
        `}</style>

        {/* Floating toggle button */}
        <Button
          onClick={() => setPreviewOnly(false)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2"
          size="sm"
        >
          <EyeOff size={16} />
          Show Editor
        </Button>

        {/* Centered preview */}
        <div className="flex justify-center items-center min-h-screen">
          <div
            ref={renderRef}
            className="shadow-lg rounded-lg overflow-hidden"
            style={{
              width: `${width}px`,
              backgroundColor: bgColor,
              padding: `${padding}px`,
              fontFamily: FONT_FAMILIES[fontFamily as keyof typeof FONT_FAMILIES],
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              color: textColor,
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: processContent(content),
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
        
        @font-face {
          font-family: 'Eudoxus Sans';
          src: url('https://fonts.cdnfonts.com/s/19990/EudoxusSans-Regular.woff') format('woff');
          font-weight: 400;
          font-style: normal;
        }
        
        @font-face {
          font-family: 'Eudoxus Sans Bold';
          src: url('https://fonts.cdnfonts.com/s/19990/EudoxusSans-Bold.woff') format('woff');
          font-weight: 700;
          font-style: normal;
        }
        
        @font-face {
          font-family: 'Eudoxus Sans';
          src: url('https://fonts.cdnfonts.com/s/19990/EudoxusSans-Bold.woff') format('woff');
          font-weight: 700;
          font-style: normal;
        }
      `}</style>

      <div className="flex h-screen">
        {/* Left Panel - Editor */}
        <div className="w-1/2 p-6 border-r border-stone-200 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">Text Editor</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant={isMarkdown ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsMarkdown(!isMarkdown)}
                  className="flex items-center gap-1"
                >
                  <FileText size={14} />
                  {isMarkdown ? "Markdown" : "HTML"}
                </Button>
                <Button onClick={handleHighlight} size="sm" className="flex items-center gap-1">
                  <Highlighter size={14} />
                  Highlight
                  <kbd className="ml-1 px-1 py-0.5 text-xs bg-stone-200 rounded">⌘H</kbd>
                </Button>
                <Button onClick={handleBold} size="sm" className="flex items-center gap-1">
                  <Bold size={14} />
                  Bold
                  <kbd className="ml-1 px-1 py-0.5 text-xs bg-stone-200 rounded">⌘B</kbd>
                </Button>
              </div>
            </div>

            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => {
                const newValue = e.target.value
                setContent(newValue)
                
                // Debounce history updates for typing
                if (historyTimeoutRef.current) {
                  clearTimeout(historyTimeoutRef.current)
                }
                historyTimeoutRef.current = setTimeout(() => {
                  addToHistory(newValue)
                }, 500)
              }}
              className="flex-1 w-full p-4 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={
                isMarkdown ? "Type or paste your markdown content here..." : "Type or paste your content here..."
              }
            />

            <div className="mt-4 text-xs text-stone-500">
              <p className="mb-1">
                <strong>Keyboard shortcuts:</strong> ⌘H to highlight, ⌘B to bold, ⌘Z to undo, ⌘Y to redo
              </p>
              {isMarkdown ? (
                <p>
                  Use <code>===text===</code> for highlights, <code>**text**</code> for bold
                </p>
              ) : (
                <p>Select text and use keyboard shortcuts or buttons</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview & Controls */}
        <div className="w-1/2 flex flex-col">
          {/* Controls */}
          <div className="p-6 bg-white border-b border-stone-200 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button
                onClick={() => setPreviewOnly(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                Preview Only
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Presets */}
              <div className="col-span-2">
                <Label className="text-sm font-medium mb-2 block">Presets</Label>
                <Select onValueChange={applyPreset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PRESETS).map((preset) => (
                      <SelectItem key={preset} value={preset}>
                        {preset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Body Font Family */}
              <div>
                <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <Type size={14} /> Body Font
                </Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(FONT_FAMILIES).map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Header Font Family */}
              <div>
                <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <Type size={14} /> Header/Bold Font
                </Label>
                <Select value={headerFontFamily} onValueChange={setHeaderFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(FONT_FAMILIES).map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Font Size</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={12}
                    max={32}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{fontSize}</span>
                </div>
              </div>

              {/* Line Height */}
              <div className="col-span-2">
                <Label className="text-sm font-medium mb-2 block">Line Height</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[lineHeight]}
                    onValueChange={(value) => setLineHeight(value[0])}
                    min={1.0}
                    max={2.0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{lineHeight.toFixed(1)}</span>
                </div>
              </div>

              {/* Width */}
              <div>
                <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <Layout size={14} /> Width
                </Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={300}
                  max={1200}
                />
              </div>

              {/* Padding */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Padding</Label>
                <Input
                  type="number"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  min={16}
                  max={80}
                />
              </div>

              {/* Colors */}
              <div>
                <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <Palette size={14} /> Background
                </Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-8 border border-stone-300 rounded"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Text Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-8 border border-stone-300 rounded"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Highlight Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => setHighlightColor(e.target.value)}
                    className="w-10 h-8 border border-stone-300 rounded"
                  />
                  <Input
                    type="text"
                    value={highlightColor}
                    onChange={(e) => setHighlightColor(e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Button 
                  onClick={() => handleExport('copy')} 
                  className="w-full flex items-center justify-center gap-2"
                  variant={copied ? "outline" : "default"}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => handleExport('download')} 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download PNG
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 p-6 bg-stone-100 overflow-auto">
            <div className="flex justify-center">
              <div
                ref={renderRef}
                className="shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: `${width}px`,
                  backgroundColor: bgColor,
                  padding: `${padding}px`,
                  fontFamily: FONT_FAMILIES[fontFamily as keyof typeof FONT_FAMILIES],
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  color: textColor,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: processContent(content),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
