import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.addEventListener("transcription:transcriptionCompleted", this.handleTranscriptionCompleted.bind(this))
  }

  async handleTranscriptionCompleted(event) {
    const { text } = event.detail
    await this.insertTextIntoActiveElement(text)
  }

  async insertTextIntoActiveElement(text) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log("Active tab: " + JSON.stringify(tab))

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        const activeElement = document.activeElement
        if (activeElement) {
          if (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT") {
            activeElement.value += text
          } else if (activeElement.isContentEditable) {
            document.execCommand("insertText", false, text)
          } else {
            activeElement.innerHTML += text
          }
        }
      },
      args: [text]
    })
  }
}