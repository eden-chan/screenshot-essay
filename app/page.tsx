"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Download, Highlighter, Palette, Type, Layout, FileText, Bold, Eye, EyeOff } from "lucide-react"
import html2canvas from "html2canvas"
import { marked } from "marked"

const FONT_FAMILIES = {
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
}

export default function HighlightEditor() {
  const [content, setContent] = useState<string>(`# The Future of AI Development: Key Insights

## 1. The Demand for AI-Native Developer Tools is Exploding

The rapid scaling of companies like **Cursor** proves there is a massive, unmet need for development environments built from the ground up with AI at their core, not just as a plugin.

**Key points:**
- Massive unmet demand for AI-native tools
- Traditional IDEs with AI plugins aren't enough
- Purpose-built solutions win

## 2. AI Progress Isn't a Slope, It's a Staircase

The jump from one model generation to the next isn't just an incremental improvement. It's a *step-function* change that unlocks entirely new categories of capabilities.

**What this means:**
1. Each new model unlocks new capabilities
2. Progress happens in discrete jumps
3. Planning must account for step changes

## 3. The Fastest Way to Build the Future is to Use It Yourself

By using Cursor to build Cursor, the team creates a powerful recursive feedback loop. This internal "dogfooding" accelerates development.`)

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

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const renderRef = useRef<HTMLDivElement>(null)

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
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [content])

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
        processed = processed.replace(/<ol>/g, '<ol style="margin: 0.5em 0; padding-left: 2em; list-style-position: outside; list-style-type: decimal;">')
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

  const handleExport = async () => {
    if (!renderRef.current) return

    try {
      // Create a temporary container with exact styling for export
      const exportContainer = document.createElement("div")
      exportContainer.style.position = "absolute"
      exportContainer.style.left = "-9999px"
      exportContainer.style.top = "0"
      exportContainer.style.width = `${width}px`
      exportContainer.style.backgroundColor = bgColor
      exportContainer.style.padding = `${padding}px`
      exportContainer.style.fontFamily = FONT_FAMILIES[fontFamily as keyof typeof FONT_FAMILIES]
      exportContainer.style.fontSize = `${fontSize}px`
      exportContainer.style.lineHeight = lineHeight.toString()
      exportContainer.style.color = textColor
      exportContainer.style.boxSizing = "border-box"

      // Add the processed content
      exportContainer.innerHTML = processContent(content)
      
      // Apply header font to all h1-h6 and strong elements
      const headerFont = FONT_FAMILIES[headerFontFamily as keyof typeof FONT_FAMILIES]
      const headers = exportContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, strong')
      headers.forEach((el) => {
        (el as HTMLElement).style.fontFamily = headerFont
      })

      // Append to body temporarily
      document.body.appendChild(exportContainer)

      const canvas = await html2canvas(exportContainer, {
        backgroundColor: bgColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: width,
        height: exportContainer.scrollHeight,
        windowWidth: width,
        windowHeight: exportContainer.scrollHeight,
      })

      // Remove temporary container
      document.body.removeChild(exportContainer)

      const link = document.createElement("a")
      link.download = "highlighted-text.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error exporting image:", error)
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
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-4 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={
                isMarkdown ? "Type or paste your markdown content here..." : "Type or paste your content here..."
              }
            />

            <div className="mt-4 text-xs text-stone-500">
              <p className="mb-1">
                <strong>Keyboard shortcuts:</strong> ⌘H to highlight, ⌘B to bold
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

              <div className="col-span-2">
                <Button onClick={handleExport} className="w-full flex items-center justify-center gap-2">
                  <Download size={16} />
                  Export as PNG
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
