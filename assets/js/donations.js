import { PROJECTS } from "./data/projects.js?v=20261114l";
import { PAYMENT } from "./data/payment.js?v=20261114l";

const select = document.getElementById("donation-project");
const options = document.getElementById("donation-options");
const custom = document.getElementById("custom-amount");
const total = document.getElementById("total-amount");
const feedback = document.getElementById("payment-feedback");
const dialog = document.getElementById("payment-dialog");
const action = document.getElementById("payment-action");
const summary = document.getElementById("dialog-summary");
const instructions = document.getElementById("payment-instructions");

const money = (value) =>
  "$" + Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

const currentProject = () => PROJECTS[select?.value] ?? Object.values(PROJECTS)[0];

function updateTotal() {
  if (!options || !total) return;
  const selected = [...options.querySelectorAll("input:checked")].reduce(
    (sum, input) => sum + Number(input.value || 0),
    0
  );
  const extra = Math.max(0, Number(custom?.value) || 0);
  total.textContent = (selected + extra).toFixed(2);
}

function setFeedback(message) {
  if (feedback) feedback.textContent = message || "";
}

function renderOptions() {
  if (!options) return;
  const project = currentProject();
  options.replaceChildren();

  project.tasks.forEach(([name, price], index) => {
    const label = document.createElement("label");
    label.className = "donation-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = String(price);
    input.id = `donation-item-${index}`;
    input.addEventListener("change", updateTotal);

    const text = document.createElement("span");
    text.textContent = `${name} — ${money(price)}`;

    label.append(input, text);
    options.append(label);
  });

  updateTotal();
}

function detailRow(label, value, { copy = false } = {}) {
  const row = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  row.append(strong, document.createTextNode(value));

  if (copy && value) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-btn";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.append(area);
        area.select();
        try {
          document.execCommand("copy");
        } catch {}
        area.remove();
      }
      button.textContent = "Copied!";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1600);
    });
    row.append(" ", button);
  }

  return row;
}

function showPendingNotice() {
  const note = document.createElement("p");
  note.textContent =
    "Payment details for each method are awaiting confirmation by Golden Gate. " +
    "Please contact the team and they will send verified instructions.";
  instructions.replaceChildren(note);
}

function showMethodDetails(method) {
  const config = PAYMENT[method];
  instructions.replaceChildren();

  if (!config) {
    const unknown = document.createElement("p");
    unknown.textContent =
      "That payment method is not available. Please choose another method or contact Golden Gate.";
    instructions.append(unknown);
    return;
  }

  if (method === "cashapp" || method === "venmo") {
    if (!config.handle) {
      showPendingNotice();
      return;
    }

    const amount = Number(total?.textContent || 0);
    const note = document.createElement("p");
    note.textContent = `Continue to ${config.label} to send your contribution to ${config.handle}.`;
    instructions.append(note);

    if (action) {
      action.hidden = false;
      action.textContent = `Open ${config.label} ↗`;
      action.href =
        method === "cashapp"
          ? `https://cash.app/$${encodeURIComponent(config.handle)}/${encodeURIComponent(amount.toFixed(2))}`
          : `https://venmo.com/?txn=pay&recipients=${encodeURIComponent(config.handle)}&amount=${encodeURIComponent(
              amount.toFixed(2)
            )}&note=${encodeURIComponent(`Donation to ${currentProject().name}`)}`;
    }
    return;
  }

  const accountName = config.accountName || "";
  const accountNumber = config.accountNumber || "";
  const bankName = config.bankName || "";

  if (!accountName && !accountNumber && !bankName) {
    showPendingNotice();
    return;
  }

  if (accountName) instructions.append(detailRow("Account name", accountName));
  if (accountNumber) instructions.append(detailRow("Account number", accountNumber, { copy: true }));
  if (bankName) instructions.append(detailRow("Bank", bankName));
  instructions.append(detailRow("Amount", money(Number(total?.textContent || 0))));
}

function openDialog() {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    setFeedback("Please use a modern browser to view payment instructions.");
  }
}

select?.addEventListener("change", renderOptions);
custom?.addEventListener("input", updateTotal);
renderOptions();

document.querySelectorAll(".project-donate").forEach((button) => {
  button.addEventListener("click", () => {
    if (!select) return;
    select.value = button.dataset.project;
    if (custom) custom.value = "";
    renderOptions();
    document.getElementById("donate")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  });
});

document.getElementById("initiate-payment")?.addEventListener("click", () => {
  setFeedback("");

  const amount = Number(total?.textContent || 0);
  const method = (document.getElementById("payment-method")?.value || "").trim();

  if (!amount || amount <= 0) {
    setFeedback("Select at least one project item or enter a contribution amount.");
    return;
  }

  if (!method) {
    setFeedback("Please choose a payment method.");
    return;
  }

  const project = currentProject();

  if (summary) {
    summary.textContent = `You are preparing a ${money(amount)} contribution to ${project.name}.`;
  }

  if (action) {
    action.hidden = true;
    action.removeAttribute("href");
  }

  instructions?.replaceChildren();

  if (!PAYMENT.verified) {
    showPendingNotice();
  } else {
    showMethodDetails(method);
  }

  openDialog();
});

document.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog?.close());
action?.addEventListener("click", () => dialog?.close());

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
