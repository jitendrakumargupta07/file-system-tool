// Mock data and functionality until connected to Python backend
let fileSystem = {
  files: {
    "readme.txt": {
      type: "file",
      size: 1024,
      created: new Date(),
      modified: new Date(),
      content: "This is a readme file with instructions.",
    },
    images: {
      type: "directory",
      size: 0,
      created: new Date(),
      modified: new Date(),
    },
    "data.bin": {
      type: "file",
      size: 2048,
      created: new Date(),
      modified: new Date(),
      content: "Binary data placeholder",
    },
    "notes.txt": {
      type: "file",
      size: 512,
      created: new Date(),
      modified: new Date(),
      content: "Important notes and reminders.",
    },
  },
  stats: {
    total_blocks: 1000,
    used_blocks: 250,
    free_blocks: 750,
    usage_percent: 25,
    block_size: 1024,
    total_size_kb: 1000,
    free_size_kb: 750,
    total_inodes: 12,
    cache_hits: 85,
    cache_misses: 15,
    cache_hit_ratio: 85,
    fragmentation_percent: 12,
    metrics: {
      reads: 205,
      writes: 97,
      allocs: 73,
      deallocs: 45,
      recoveries: 2,
    },
  },
  systemLogs: [
    "INFO: File system initialized with 1000 blocks",
    "INFO: Root directory created successfully",
    "INFO: Created file readme.txt",
    "INFO: Created directory images",
    "INFO: Created file data.bin",
    "INFO: Created file notes.txt",
  ],
};

// Helper function to format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / 1048576).toFixed(2) + " MB";
}

// Helper function to format date
function formatDate(date) {
  return new Date(date).toLocaleString();
}

// Display files
function displayFiles() {
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";

  Object.entries(fileSystem.files).forEach(([name, metadata]) => {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";

    const iconClass =
      metadata.type === "directory" ? "directory-icon" : "file-icon";
    const icon = metadata.type === "directory" ? "📁" : "📄";

    fileItem.innerHTML = `
            <div class="file-name">
                <span class="${iconClass}">${icon}</span>
                ${name}
                <span style="margin-left: 10px; font-size: 12px; color: #777;">
                    ${formatSize(metadata.size)}
                </span>
            </div>
            <div class="file-actions">
                <button title="View" data-filename="${name}" class="view-file-btn">👁</button>
                <button title="Download" data-filename="${name}" class="download-file-btn">💾</button>
                <button title="Delete" data-filename="${name}" class="delete-file-btn">🗑</button>
            </div>
        `;
    fileList.appendChild(fileItem);
  });

  // Add event listeners to file action buttons
  document.querySelectorAll(".view-file-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filename = this.getAttribute("data-filename");
      viewFile(filename);
    });
  });

  document.querySelectorAll(".download-file-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filename = this.getAttribute("data-filename");
      downloadFile(filename);
    });
  });

  document.querySelectorAll(".delete-file-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filename = this.getAttribute("data-filename");
      deleteFile(filename);
    });
  });
}

// Update system stats display
function updateSystemStats() {
  document.getElementById(
    "disk-usage"
  ).textContent = `${fileSystem.stats.usage_percent.toFixed(1)}%`;
  document.getElementById(
    "disk-usage-bar"
  ).style.width = `${fileSystem.stats.usage_percent}%`;
  document.getElementById(
    "free-space"
  ).textContent = `${fileSystem.stats.free_size_kb} KB`;
  document.getElementById(
    "fragmentation"
  ).textContent = `${fileSystem.stats.fragmentation_percent.toFixed(1)}%`;
  document.getElementById(
    "cache-hit"
  ).textContent = `${fileSystem.stats.cache_hit_ratio.toFixed(1)}%`;
  document.getElementById("total-files").textContent = Object.keys(
    fileSystem.files
  ).length;

  // Update performance metrics
  document.getElementById("read-ops").textContent =
    fileSystem.stats.metrics.reads;
  document.getElementById("write-ops").textContent =
    fileSystem.stats.metrics.writes;
  document.getElementById("alloc-ops").textContent =
    fileSystem.stats.metrics.allocs;
  document.getElementById("dealloc-ops").textContent =
    fileSystem.stats.metrics.deallocs;
  document.getElementById("recovery-ops").textContent =
    fileSystem.stats.metrics.recoveries;
}

// Update system logs
function updateSystemLogs() {
  const logsElement = document.getElementById("system-logs");
  logsElement.value = fileSystem.systemLogs.join("\n");
  logsElement.scrollTop = logsElement.scrollHeight;
}

// Add a new log entry
function addLogEntry(message) {
  const timestamp = new Date().toLocaleString();
  const logEntry = `${timestamp} - ${message}`;
  fileSystem.systemLogs.push(logEntry);
  updateSystemLogs();
}

// Show alert message
function showAlert(message, type = "success") {
  const alertsContainer = document.getElementById("alerts-container");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;

  const icon = type === "success" ? "✅" : type === "danger" ? "❌" : "⚠";
  alert.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  alertsContainer.appendChild(alert);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// View file function
function viewFile(filename) {
  const file = fileSystem.files[filename];
  if (!file) return;

  document.getElementById("view-file-name").textContent = filename;

  // Use actual content if available, otherwise show placeholder
  const content =
    file.content ||
    `This is the content of ${filename}.\nIn a real implementation, this would display actual file content from the Python backend.`;
  document.getElementById("view-file-content").value = content;

  const modal = document.getElementById("view-file-modal");
  modal.style.display = "flex";

  // Increment read operations
  fileSystem.stats.metrics.reads++;
  updateSystemStats();

  addLogEntry(`INFO: Viewed file ${filename}`);
}

// Download file function
function downloadFile(filename) {
  const file = fileSystem.files[filename];
  if (!file || file.type === "directory") {
    showAlert(`Cannot download ${filename}`, "warning");
    return;
  }

  // In a real implementation, this would initiate an actual download
  showAlert(`Download started for "${filename}"`, "success");
  addLogEntry(`INFO: Downloaded file ${filename}`);

  // Increment read operations
  fileSystem.stats.metrics.reads++;
  updateSystemStats();
}

// Delete file function
function deleteFile(filename) {
  if (confirm(`Are you sure you want to delete ${filename}?`)) {
    delete fileSystem.files[filename];
    displayFiles();
    showAlert(`File "${filename}" deleted successfully.`, "success");
    addLogEntry(`INFO: Deleted ${filename}`);

    // Update stats - simulate some changes
    fileSystem.stats.used_blocks -= 5;
    fileSystem.stats.free_blocks += 5;
    fileSystem.stats.usage_percent =
      (fileSystem.stats.used_blocks / fileSystem.stats.total_blocks) * 100;
    fileSystem.stats.metrics.deallocs++;
    updateSystemStats();
  }
}

// Create file function
function createFile() {
  const filename = document.getElementById("file-name").value.trim();
  const content = document.getElementById("file-content").value;

  if (!filename) {
    showAlert("Please enter a file name.", "danger");
    return;
  }

  if (fileSystem.files[filename]) {
    showAlert("A file with this name already exists.", "danger");
    return;
  }

  // Add the file to the system
  fileSystem.files[filename] = {
    type: "file",
    size: content.length,
    created: new Date(),
    modified: new Date(),
    content: content,
  };

  // Close modal
  document.getElementById("create-file-modal").style.display = "none";

  // Update UI
  displayFiles();
  showAlert(`File "${filename}" created successfully.`, "success");
  addLogEntry(`INFO: Created file ${filename}`);

  // Update stats - simulate some changes
  fileSystem.stats.used_blocks += 2;
  fileSystem.stats.free_blocks -= 2;
  fileSystem.stats.usage_percent =
    (fileSystem.stats.used_blocks / fileSystem.stats.total_blocks) * 100;
  fileSystem.stats.metrics.writes++;
  fileSystem.stats.metrics.allocs++;
  updateSystemStats();

  // Reset form
  document.getElementById("file-name").value = "";
  document.getElementById("file-content").value = "";
}

// Simulate crash and recovery
function simulateCrash() {
  if (confirm("Are you sure you want to simulate a system crash?")) {
    showAlert("Simulating file system crash...", "warning");
    addLogEntry("WARNING: File system crash simulation initiated");

    setTimeout(() => {
      addLogEntry("INFO: Starting file system recovery process");

      // Simulate recovery process with progress updates
      let progress = 0;
      const recoveryInterval = setInterval(() => {
        progress += 10;
        addLogEntry(`INFO: Recovery progress ${progress}%`);

        if (progress >= 100) {
          clearInterval(recoveryInterval);
          addLogEntry("INFO: File system recovery completed successfully");
          fileSystem.stats.metrics.recoveries++;
          updateSystemStats();
          showAlert("File system recovered successfully!", "success");
        }
      }, 500);
    }, 1000);
  }
}

// Check system integrity
function checkIntegrity() {
  showAlert("Checking file system integrity...", "warning");
  addLogEntry("INFO: Starting file system integrity check");

  const integrityModal = document.getElementById("integrity-modal");
  const resultsContainer = document.getElementById("integrity-results");
  resultsContainer.innerHTML = "<p>Checking integrity...</p>";
  integrityModal.style.display = "flex";

  // Simulate integrity check process
  setTimeout(() => {
    // Generate random issues
    const issues = [];
    if (Math.random() > 0.5) {
      issues.push({
        type: "error",
        message: "Invalid block reference detected in inode table",
        fixable: true,
      });
    }
    if (Math.random() > 0.7) {
      issues.push({
        type: "warning",
        message: "Fragmentation level exceeds optimal threshold",
        fixable: true,
      });
    }
    if (Math.random() > 0.6) {
      issues.push({
        type: "info",
        message: "Cache hit ratio below expected performance",
        fixable: false,
      });
    }

    // Display results
    if (issues.length === 0) {
      resultsContainer.innerHTML = `
                <div class="alert alert-success">
                    <p>✅ No issues found. File system integrity verified.</p>
                </div>
            `;
      document.getElementById("fix-issues-btn").style.display = "none";
    } else {
      let resultsHTML = `<div class="alert alert-warning">
                <p>⚠ Found ${issues.length} issue(s) in file system:</p>
            </div>`;

      issues.forEach((issue, index) => {
        const badgeClass =
          issue.type === "error"
            ? "badge-danger"
            : issue.type === "warning"
            ? "badge-warning"
            : "badge-success";
        resultsHTML += `
                    <div class="stats-card">
                        <h4>Issue #${
                          index + 1
                        } <span class="badge ${badgeClass}">${
          issue.type
        }</span></h4>
                        <p>${issue.message}</p>
                        <small>${
                          issue.fixable
                            ? "Can be automatically fixed"
                            : "Manual inspection required"
                        }</small>
                    </div>
                `;
      });

      resultsContainer.innerHTML = resultsHTML;
      document.getElementById("fix-issues-btn").style.display = "block";
    }

    addLogEntry(
      `INFO: Integrity check complete. Found ${issues.length} issues.`
    );
  }, 2000);
}

// Fix integrity issues
function fixIntegrityIssues() {
  showAlert("Fixing file system issues...", "warning");
  addLogEntry("INFO: Starting automatic repair process");

  // Simulate repair process
  let progress = 0;
  const repairInterval = setInterval(() => {
    progress += 20;
    addLogEntry(`INFO: Repair progress ${progress}%`);

    if (progress >= 100) {
      clearInterval(repairInterval);
      addLogEntry("INFO: Automatic repair completed successfully");

      // Update some stats to reflect the repair
      fileSystem.stats.fragmentation_percent = Math.max(
        5,
        fileSystem.stats.fragmentation_percent - 5
      );
      fileSystem.stats.cache_hit_ratio = Math.min(
        95,
        fileSystem.stats.cache_hit_ratio + 5
      );
      updateSystemStats();

      showAlert("File system issues fixed successfully!", "success");

      // Update the integrity results
      document.getElementById("integrity-results").innerHTML = `
                <div class="alert alert-success">
                    <p>✅ All issues have been resolved. File system integrity restored.</p>
                </div>
            `;
      document.getElementById("fix-issues-btn").style.display = "none";
    }
  }, 500);
}

// Optimize file system
function optimizeFileSystem() {
  showAlert("Starting file system optimization...", "warning");
  addLogEntry("INFO: Beginning optimization process");

  // Simulate optimization process
  let progress = 0;
  const optimizeInterval = setInterval(() => {
    progress += 10;
    addLogEntry(`INFO: Optimization progress ${progress}%`);

    if (progress >= 100) {
      clearInterval(optimizeInterval);

      // Update stats to reflect optimization
      fileSystem.stats.fragmentation_percent = Math.max(
        2,
        fileSystem.stats.fragmentation_percent * 0.5
      );
      fileSystem.stats.cache_hit_ratio = Math.min(
        98,
        fileSystem.stats.cache_hit_ratio * 1.1
      );
      fileSystem.stats.free_blocks += 15; // Simulated space recovery
      fileSystem.stats.used_blocks -= 15;
      fileSystem.stats.usage_percent =
        (fileSystem.stats.used_blocks / fileSystem.stats.total_blocks) * 100;
      fileSystem.stats.free_size_kb =
        fileSystem.stats.free_blocks * (fileSystem.stats.block_size / 1024);

      updateSystemStats();
      addLogEntry("INFO: File system optimization completed successfully");
      showAlert("File system optimized successfully!", "success");
    }
  }, 300);
}

// Initialize performance chart
function initializePerformanceChart() {
  const ctx = document.getElementById("performance-chart").getContext("2d");

  // Generate some mock data for the chart
  const labels = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
  ];
  const readData = [10, 15, 25, 30, 28, 35, 45];
  const writeData = [5, 10, 15, 12, 18, 20, 25];

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Read Operations",
          data: readData,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          tension: 0.3,
          fill: true,
        },
        {
          label: "Write Operations",
          data: writeData,
          borderColor: "#2ecc71",
          backgroundColor: "rgba(46, 204, 113, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "File System Operations (Last 7 Days)",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Operations",
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  });
}

// Handle file upload from the upload modal
function setupFileUpload() {
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("file-input");

  // Setup drag and drop events
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropArea.style.borderColor = "#3498db";
    dropArea.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
  }

  function unhighlight() {
    dropArea.style.borderColor = "#ddd";
    dropArea.style.backgroundColor = "transparent";
  }

  // Handle file drop
  dropArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  // Handle file selection through input
  dropArea.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    if (files.length === 0) return;

    // Process each file
    Array.from(files).forEach((file) => {
      // Simulate file upload
      let progress = 0;
      const progressBar = document.getElementById("upload-progress");

      const uploadInterval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
          clearInterval(uploadInterval);

          // Add file to our mock file system
          fileSystem.files[file.name] = {
            type: "file",
            size: file.size,
            created: new Date(),
            modified: new Date(),
            content: `Simulated content for ${file.name}`,
          };

          // Update stats
          const sizeInBlocks = Math.ceil(
            file.size / fileSystem.stats.block_size
          );
          fileSystem.stats.used_blocks += sizeInBlocks;
          fileSystem.stats.free_blocks -= sizeInBlocks;
          fileSystem.stats.usage_percent =
            (fileSystem.stats.used_blocks / fileSystem.stats.total_blocks) *
            100;
          fileSystem.stats.free_size_kb =
            fileSystem.stats.free_blocks * (fileSystem.stats.block_size / 1024);
          fileSystem.stats.metrics.writes++;
          fileSystem.stats.metrics.allocs++;

          updateSystemStats();
          displayFiles();
          addLogEntry(
            `INFO: Uploaded file ${file.name} (${formatSize(file.size)})`
          );

          // Hide modal after upload
          document.getElementById("upload-modal").style.display = "none";
          progressBar.style.width = "0%";

          showAlert(`File "${file.name}" uploaded successfully.`, "success");
        }
      }, 100);
    });
  }
}

// Event listeners and initialization code
document.addEventListener("DOMContentLoaded", function () {
  // Initial display
  displayFiles();
  updateSystemStats();
  updateSystemLogs();
  initializePerformanceChart();
  setupFileUpload();

  // Tab switching
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Update active tab
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show selected tab content
      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));
      document.getElementById(`tab-${tabId}`).classList.add("active");
    });
  });

  // Modal event listeners
  // Create file modal
  document.getElementById("create-file-btn").addEventListener("click", () => {
    document.getElementById("create-file-modal").style.display = "flex";
  });

  document
    .getElementById("close-create-modal")
    .addEventListener("click", () => {
      document.getElementById("create-file-modal").style.display = "none";
    });

  document.getElementById("cancel-create").addEventListener("click", () => {
    document.getElementById("create-file-modal").style.display = "none";
  });

  document
    .getElementById("confirm-create")
    .addEventListener("click", createFile);

  // Upload file modal
  document.getElementById("upload-file-btn").addEventListener("click", () => {
    document.getElementById("upload-modal").style.display = "flex";
  });

  document
    .getElementById("close-upload-modal")
    .addEventListener("click", () => {
      document.getElementById("upload-modal").style.display = "none";
    });

  document.getElementById("cancel-upload").addEventListener("click", () => {
    document.getElementById("upload-modal").style.display = "none";
  });

  // View file modal
  document.getElementById("close-view-modal").addEventListener("click", () => {
    document.getElementById("view-file-modal").style.display = "none";
  });

  document.getElementById("close-view-btn").addEventListener("click", () => {
    document.getElementById("view-file-modal").style.display = "none";
  });

  document.getElementById("edit-file-btn").addEventListener("click", () => {
    const filename = document.getElementById("view-file-name").textContent;
    const content = document.getElementById("view-file-content").value;

    // Toggle readonly attribute to enable editing
    const textarea = document.getElementById("view-file-content");
    const isReadOnly = textarea.hasAttribute("readonly");

    if (isReadOnly) {
      textarea.removeAttribute("readonly");
      document.getElementById("edit-file-btn").textContent = "Save";
    } else {
      textarea.setAttribute("readonly", true);
      document.getElementById("edit-file-btn").textContent = "Edit";

      // Save the content
      if (fileSystem.files[filename]) {
        fileSystem.files[filename].content = content;
        fileSystem.files[filename].modified = new Date();
        fileSystem.files[filename].size = content.length;

        // Update stats
        fileSystem.stats.metrics.writes++;
        updateSystemStats();

        showAlert(`File "${filename}" saved successfully.`, "success");
        addLogEntry(`INFO: Modified file ${filename}`);
      }
    }
  });

  // Integrity check modal
  document
    .getElementById("check-integrity-btn")
    .addEventListener("click", checkIntegrity);

  document
    .getElementById("close-integrity-modal")
    .addEventListener("click", () => {
      document.getElementById("integrity-modal").style.display = "none";
    });

  document
    .getElementById("close-integrity-btn")
    .addEventListener("click", () => {
      document.getElementById("integrity-modal").style.display = "none";
    });

  document
    .getElementById("fix-issues-btn")
    .addEventListener("click", fixIntegrityIssues);

  // Other button actions
  document
    .getElementById("simulate-crash-btn")
    .addEventListener("click", simulateCrash);
  document
    .getElementById("optimize-btn")
    .addEventListener("click", optimizeFileSystem);

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Add some initial log entries to make it look more realistic
  setTimeout(() => {
    addLogEntry("INFO: System initialized and ready");
    addLogEntry("INFO: Cache initialized with 8MB allocation");
    addLogEntry("INFO: Journal replay complete");
  }, 500);
});
