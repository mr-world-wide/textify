import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["start", "stop", "status"]

  initialize() {
    console.log("Recorder controller initialized")
    this.isRecording = false
    this.mediaRecorder = null
    this.audioChunks = []
  }

  connect() {
    console.log("Recorder controller connected")
    this.stopTarget.disabled = true
  }

  startRecording() {
    console.log("Start recording initiated")
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log("Microphone access granted")
        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.addEventListener("dataavailable", event => {
          console.log("Data available: " + JSON.stringify(event.data))
          this.audioChunks.push(event.data)
        })
        this.mediaRecorder.addEventListener("stop", () => {
          this.dispatch("recordingCompleted", { detail: { audioChunks: this.audioChunks } })
        })

        this.mediaRecorder.start()
        console.log("Media recorder started")
        this.statusTarget.textContent = "Recording..."
        this.startTarget.disabled = true
        this.stopTarget.disabled = false
        this.isRecording = true
      })
      .catch(err => {
        console.error("Error accessing microphone: " + err.message)
        this.statusTarget.textContent = "Microphone access denied"
      })
  }

  stopRecording() {
    console.log("Stop recording initiated")
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop()
      this.statusTarget.textContent = "Processing..."
      this.startTarget.disabled = false
      this.stopTarget.disabled = true
      console.log("Media recorder stopped")
      this.isRecording = false
    }
  }
}