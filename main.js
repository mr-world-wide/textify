import { Application } from "@hotwired/stimulus"
import RecorderController from "./controllers/recorder_controller"
import TranscriptionController from "./controllers/transcription_controller"
import TextInsertionController from "./controllers/text_insertion_controller"

const application = Application.start()
application.register("recorder", RecorderController)
application.register("transcription", TranscriptionController)
application.register("text-insertion", TextInsertionController)