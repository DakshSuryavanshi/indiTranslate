//hero section
document.addEventListener("DOMContentLoaded", function() {
  const hero = document.querySelector(".hero");

  setTimeout(() => {
      hero.classList.add("active");
  }, 200);
});


// Function to populate a select element with options
function populateSelect(select, options) {
  select.innerHTML = "";
  options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.code;
      optionElement.textContent = option.name + " (" + option.native + ")";
      select.appendChild(optionElement);
  });
}

// text language card
const inputLanguageDropdown = document.querySelector("#input-language select");
const outputLanguageDropdown = document.querySelector("#output-language select");

populateSelect(inputLanguageDropdown, languagesInput);
populateSelect(outputLanguageDropdown, languagesOutput);


// audio language card
const inputLanguageDropdownnn = document.querySelector("#inputtt-language select");
const outputLanguageDropdownnn = document.querySelector("#outputtt-language select");

populateSelect(inputLanguageDropdownnn, languagesInput); 
populateSelect(outputLanguageDropdownnn, languagesOutput); 

// image language card
const inputLanguageDropdownn = document.querySelector("#inputt-language select");
const outputLanguageDropdownn = document.querySelector("#outputt-language select");

populateSelect(inputLanguageDropdownn, languagesInput); 
populateSelect(outputLanguageDropdownn, languagesOutput); 



// Swap button
const swapBtn = document.querySelector(".swap-position");
const inputLanguage = inputLanguageDropdown.querySelector("option:checked");
const outputLanguage = outputLanguageDropdown.querySelector("option:checked");
const inputTextElem = document.querySelector("#input-text");
const outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
  const tempInputValue = inputLanguage.value;
  inputLanguage.value = outputLanguage.value;
  outputLanguage.value = tempInputValue;

  const tempInputText = inputLanguage.textContent;
  inputLanguage.textContent = outputLanguage.textContent;
  outputLanguage.textContent = tempInputText;

  const tempInputTextValue = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputTextValue;
});


// Upload doc
const uploadDocument = document.querySelector("#upload-document");
const uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file.type === "text/plain" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
      uploadTitle.innerHTML = file.name;
  } else {
      alert("Please upload a valid file");
  }
});


//audio record
const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const audioPlayer = document.getElementById('audioPlayer');
let mediaRecorder;
let audioChunks = [];

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
          audioChunks.push(event.data);
      }
  };

  mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, {
          type: 'audio/wav'
      });
      audioPlayer.src = URL.createObjectURL(audioBlob);
  };

  mediaRecorder.start();
  startRecordButton.disabled = true;
  stopRecordButton.disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();
  startRecordButton.disabled = false;
  stopRecordButton.disabled = true;
}

startRecordButton.addEventListener('click', startRecording);
stopRecordButton.addEventListener('click', stopRecording);

//audio upload
const uploadAudio = document.querySelector("#upload-audio");
const audioTitle = document.querySelector("#audio-title");

uploadAudio.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (
    file.type === "audio/mpeg" ||
    file.type === "audio/wav" ||
    file.type === "audio/ogg"
  ) {
    // Handle supported audio file types
    audioTitle.innerHTML = file.name;
  } else {
    alert("Please upload a valid audio file (MP3, WAV, or OGG).");
  }
});

// audio preview
uploadAudio.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const audioURL = URL.createObjectURL(file);

    audioPlayer.src = audioURL;
    audioPlayer.controls = true;
  } else {
    audioPlayer.src = "";
    audioPlayer.controls = false;
  }
});

// image
const uploadImageInput = document.querySelector("#upload-image");
const imagePreview = document.querySelector("#image-preview");
const uploadImageTitle = document.querySelector("#upload-image-title");

uploadImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
      if (file.type.startsWith("image/")) {
          uploadImageTitle.innerHTML = file.name;

          const reader = new FileReader();
          reader.onload = function(e) {
              imagePreview.src = e.target.result;
              imagePreview.style.display = "block";
          };
          reader.readAsDataURL(file);
      } else {
          alert("Please upload a valid image file.");
      }
  } else {
      alert("Please select an image to upload.");
  }
});


//download pdf button
const downloadBtnpdf = document.querySelector("#download-btn-pdf");

downloadBtnpdf.addEventListener("click", (e) => {
  const outputText = outputTextElem.value;
  const outputLanguage =
      outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
      const blob = new Blob([outputText], {
          type: "text/plain"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `translated-to-${outputLanguage}.txt`;
      a.href = url;
      a.click();
  }
});

//download image button
const downloadBtnimg = document.querySelector("#download-btn-img");

downloadBtnimg.addEventListener("click", (e) => {
  const outputText = outputTextElem.value;
  const outputLanguage =
      outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
      const blob = new Blob([outputText], {
          type: "text/plain"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `translated-to-${outputLanguage}.txt`;
      a.href = url;
      a.click();
  }
});


//theme
const userThemePreference = localStorage.getItem("darkModeEnabled");
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
const isDarkModeEnabled = userThemePreference === "true" || (userThemePreference === null && prefersDarkMode);
const darkModeCheckbox = document.getElementById("dark-mode-btn");

if (isDarkModeEnabled) {
  document.body.classList.add("dark");
  darkModeCheckbox.checked = true;
}
darkModeCheckbox.addEventListener("change", () => {
  if (darkModeCheckbox.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("darkModeEnabled", "true");
  } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkModeEnabled", "false");
  }
});

//char count
const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length;
});

//sign in pop up
const signInButton = document.getElementById('signInButton');
const signInPopup = document.getElementById('signInPopup');
const closePopup = document.getElementById('closePopup');

signInButton.addEventListener('click', () => {
  signInPopup.style.display = 'block';
});

closePopup.addEventListener('click', () => {
  signInPopup.style.display = 'none';
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === signInPopup) {
      signInPopup.style.display = 'none';
  }
});

//faq pop up
const faqLink = document.getElementById('faqLink');
const faqPopup = document.getElementById('faqPopup');
const faqclosePopup = document.getElementById('faqclosePopup');

faqLink.addEventListener('click', (event) => {
  faqPopup.style.display = 'block';
});

faqclosePopup.addEventListener('click', () => {
  faqPopup.style.display = 'none';
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === faqPopup) {
      faqPopup.style.display = 'none';
  }
});

//privacy policy pop up
const ppLink = document.getElementById('ppLink');
const ppPopup = document.getElementById('ppPopup');
const ppclosePopup = document.getElementById('ppclosePopup');

ppLink.addEventListener('click', (event) => {
  ppPopup.style.display = 'block';
});

ppclosePopup.addEventListener('click', () => {
  ppPopup.style.display = 'none';
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === ppPopup) {
      ppPopup.style.display = 'none';
  }
});

//Copyright pop up
const crLink = document.getElementById('crLink');
const crPopup = document.getElementById('crPopup');
const crclosePopup = document.getElementById('crclosePopup');

crLink.addEventListener('click', (event) => {
  crPopup.style.display = 'block';
});

crclosePopup.addEventListener('click', () => {
  crPopup.style.display = 'none';
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === crPopup) {
      crPopup.style.display = 'none';
  }
});

//responsive nav menu
function myFunctionmenu() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
      x.className += "responsive";
  } else {
      x.className = "topnav";
  }
}

//translate reload
function submitForm() {
  const formData = new FormData(document.getElementById('form'));

  fetch('/translate', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('output-text').value = data.output;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Add an event listener to the form submit
document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm(); // Call the submitForm function when the form is submitted
});


//extracted text from doc to input-text textarea
uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file.type === "text/plain" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
      uploadTitle.innerHTML = file.name;

      const formData = new FormData();
      formData.append("file", file);

      fetch("/extract", {
              method: "POST",
              body: formData,
          })
          .then(response => response.json())
          .then(data => {
              inputTextElem.value = data.extracted_text;
          })
          .catch(error => {
              console.error("Error:", error);
          });
  } else {
      alert("Please upload a valid file");
  }
});

// download button pdf
$(document).ready(function() {
  $("#download-btn-pdf").click(function() {
      var text = $("#output-text").val();

      $.ajax({
          type: "POST",
          url: "/convert_to_pdf",
          data: {
              "output-text": text
          },
          success: function() {
              window.location.href = "/download_pdf";
          },
          error: function() {
              alert("Error occurred while converting to PDF.");
          }
      });
  });
});

//image input output
$(document).ready(function () {
  function processAndTranslateImage() {
    console.log("Entering processAndTranslateImage");
  
    var inputImage = $("#upload-image")[0].files[0];
    if (!inputImage) {
      alert("Please select an image.");
      console.log("No input image selected");
      return;
    }
  
    console.log("Input image selected:", inputImage);
  
    var formData = new FormData();
    formData.append("file", inputImage);
  
    console.log("FormData created:", formData);
  
    $.ajax({
      url: "/process_image",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log("AJAX request successful");
        if (response) {
          const imgElement = document.getElementById("image-preview1"); 
          imgElement.src = response;
          console.log("Image preview updated with processed image");
          const loadingTimer = document.getElementById('loading-timer');
          loadingTimer.style.display = 'none';
          loadingTimer.innerText = '';
        } else {
          $("#image-preview1").text("Processing/Translation failed.");
          console.log("Processing/Translation failed");
        }
        
      },

      error: function () {
        console.log("AJAX request failed");
  
        $("#image-preview1").text("Error occurred during processing/translation.");
        console.log("Error occurred during processing/translation");
      }
    });
  }
  
// Add a click event listener to the parent element of all translate buttons
$(".container").on("click", ".translatebutton", function () {
  // Get the associated card based on the data-card attribute
  const card = $(this).data("card");

  // Perform the translation based on the card
  if (card === "image-card") {
    processAndTranslateImage();
  } 
});

});

// Modify your JavaScript code for image translation

function startLoadingTimer() {
  const loadingTimer = document.getElementById('loading-timer');
  loadingTimer.style.display = 'block';

  let checkInterval = setInterval(() => {
      const outputImage = document.getElementById('image-preview1');
      if (outputImage.complete) {
          clearInterval(checkInterval); // Stop checking when the image is loaded
          loadingTimer.style.display = 'none'; // Hide the loading timer
      }
  }, 10000); // Check every 100 milliseconds

  // If the image doesn't load within a certain time, you can set a timeout to handle that case
  setTimeout(() => {
      clearInterval(checkInterval); // Stop checking
      loadingTimer.innerText = 'Image loading timed out'; // Display a message
  }, 600000); // Timeout after 60 seconds (adjust as needed)
}

document.getElementById('tbtnn').addEventListener('click', () => {
  startLoadingTimer(); // Call this function when the translate button is clicked
  processAndTranslateImage();
});

