import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.element.addEventListener("recorder:recordingCompleted", this.handleRecordingCompleted.bind(this))
  }

  async handleRecordingCompleted(event) {
    const { audioChunks } = event.detail
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
    const base64data = await this.blobToBase64(audioBlob)
    
    try {
      const response = await fetch("https://kendylwhisper.replit.app/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64data })
      })
      const result = await response.json()
      const text = result.text
      
      if (typeof text === "string") {
        this.dispatch("transcriptionCompleted", { detail: { text } })
      } else {
        console.warn("Transcribed text is not a string: " + typeof text)
      }
    } catch (error) {
      console.error("Error during transcription: " + error.message)
      this.statusTarget.textContent = "Transcription failed"
    }
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(",")[1])
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}