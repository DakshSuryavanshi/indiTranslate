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

populateSelect(inputLanguageDropdown, languages);
populateSelect(outputLanguageDropdown, languages);

// Output language card
const inputLanguageDropdownn = document.querySelector("#inputt-language select");
const outputLanguageDropdownn = document.querySelector("#outputt-language select");

populateSelect(inputLanguageDropdownn, languages);
populateSelect(outputLanguageDropdownn, languages);


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


//upload doc
const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file.type === "application/pdf") {
      uploadTitle.innerHTML = file.name;

      // Use pdf.js to extract text from the PDF file
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const pdf = await pdfjsLib.getDocument({
              data: arrayBuffer
          }).promise;
          const text = [];
          for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const pageText = await page.getTextContent();
              pageText.items.forEach((item) => {
                  text.push(item.str);
              });
          }
          inputTextElem.value = text.join("\n");
      };
  } else if (
      file.type === "text/plain" ||
      file.type === "application/msword" ||
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
      // Handle other supported file types
      uploadTitle.innerHTML = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
          inputTextElem.value = e.target.result;
      };
  } else {
      alert("Please upload a valid file");
  }
});

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


const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", (e) => {
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

const darkModeCheckbox = document.getElementById("dark-mode-btn");

// Function to set the theme based on the user's preference
function setThemeBasedOnPreference() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark");
    darkModeCheckbox.checked = true;
    localStorage.setItem("darkModeEnabled", "true");
  } else {
    document.body.classList.remove("dark");
    darkModeCheckbox.checked = false;
    localStorage.setItem("darkModeEnabled", "false");
  }
}

// Check local storage for the theme preference and set it if available
const isDarkModeEnabled = localStorage.getItem("darkModeEnabled");
if (isDarkModeEnabled === "true" || isDarkModeEnabled === "false") {
  setThemeBasedOnPreference();
} else {
  // If no preference is stored in local storage, set the theme based on device preference
  setThemeBasedOnPreference();
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


