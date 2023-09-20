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

// Input language card
const inputLanguageDropdown = document.querySelector("#input-language select");
const outputLanguageDropdown = document.querySelector("#output-language select");

populateSelect(inputLanguageDropdown, languagesInput);
populateSelect(outputLanguageDropdown, languagesOutput);

// Output language card
const inputLanguageDropdownn = document.querySelector("#inputt-language select");
const outputLanguageDropdownn = document.querySelector("#outputt-language select");

populateSelect(inputLanguageDropdownn, languagesInput); // You can use the same input languages for the output card if needed
populateSelect(outputLanguageDropdownn, languagesOutput); // Use the same output languages for the output card


// Swap button
const swapBtn = document.querySelector(".swap-position");
const inputLanguage = inputLanguageDropdown.querySelector("option:checked");
const outputLanguage = outputLanguageDropdown.querySelector("option:checked");
const inputTextElem = document.querySelector("#input-text");
const outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
  // Swap selected options in the dropdowns
  const tempInputValue = inputLanguage.value;
  inputLanguage.value = outputLanguage.value;
  outputLanguage.value = tempInputValue;

  // Swap displayed text in the dropdowns
  const tempInputText = inputLanguage.textContent;
  inputLanguage.textContent = outputLanguage.textContent;
  outputLanguage.textContent = tempInputText;

  // Swap input and output text
  const tempInputTextValue = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputTextValue;
});


// Upload doc
const uploadDocument = document.querySelector("#upload-document");
const uploadTitle = document.querySelector("#upload-title");
// const inputTextElem = document.querySelector("#input-text");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file.type === "text/plain" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
      // Handle supported file types
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

// image
const uploadImageInput = document.querySelector("#upload-image");
const imagePreview = document.querySelector("#image-preview");
const uploadImageTitle = document.querySelector("#upload-image-title");

uploadImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
      if (file.type.startsWith("image/")) {
          uploadImageTitle.innerHTML = file.name;

          // Display the image preview
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
      // Handle no file selected
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
// Check if the user has already set a custom theme preference
const userThemePreference = localStorage.getItem("darkModeEnabled");

// Check if the user's operating system prefers dark mode
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Determine the initial theme based on user preference and OS preference
const isDarkModeEnabled = userThemePreference === "true" || (userThemePreference === null && prefersDarkMode);

// Get the dark mode checkbox element
const darkModeCheckbox = document.getElementById("dark-mode-btn");

// Set the initial theme
if (isDarkModeEnabled) {
  document.body.classList.add("dark");
  darkModeCheckbox.checked = true;
}

// Add an event listener to handle theme changes
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
document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the form from submitting

  const formData = new FormData(this);

  // Send a POST request to your Flask endpoint
  fetch('/translate', {
          method: 'POST',
          body: formData,
      })
      .then(response => response.json()) // Parse JSON response
      .then(data => {
          // Handle the response data and set it as the value of #output-text
          document.getElementById('output-text').value = data.output;
      })
      .catch(error => {
          console.error('Error:', error);
      });
});


//extracted text from doc to input-text textarea
uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file.type === "text/plain" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
      uploadTitle.innerHTML = file.name;

      // Send an AJAX request to the Flask server to get the extracted text
      const formData = new FormData();
      formData.append("file", file);

      fetch("/extract", {
              method: "POST",
              body: formData,
          })
          .then(response => response.json())
          .then(data => {
              inputTextElem.value = data.extracted_text; // Set the value of the textarea
          })
          .catch(error => {
              console.error("Error:", error);
          });
  } else {
      alert("Please upload a valid file");
  }
});

// JavaScript code for sending the AJAX request
$(document).ready(function() {
  $("#download-btn-pdf").click(function() {
      // Get the text from the textarea
      var text = $("#output-text").val();

      // Send an AJAX POST request to the /convert_to_pdf route
      $.ajax({
          type: "POST",
          url: "/convert_to_pdf",
          data: {
              "output-text": text
          },
          success: function() {
              // Redirect to the PDF download route
              window.location.href = "/download_pdf";
          },
          error: function() {
              alert("Error occurred while converting to PDF.");
          }
      });
  });
});