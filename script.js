import { html, css, LitElement } from "https://unpkg.com/lit@2/index.js?module";
import { hofMember } from "./hofPlayers.js";

class HofSearch extends LitElement {
  static styles = css`
    input {
      padding: 0.5rem;
      margin: 0.5rem;
      border-radius: 5px;
      width: 250px;
    }
    .player-card {
      border: 1px solid #ccc;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    button {
      margin: 1rem;
      padding: 0.5rem 1rem;
    }
  `;

  static properties = {
    firstNameTerm: { type: String },
    lastNameTerm: { type: String },
    teamTerm: { type: String },
    positionTerm: { type: String },
    nationalityTerm: { type: String },
    awardTerm: { type: String },
    suffixTerm: { type: String },
    showAll: { type: Boolean },
  };

  constructor() {
    super();
    this.firstNameTerm = "";
    this.lastNameTerm = "";
    this.teamTerm = "All Teams";
    this.positionTerm = "All Positions";
    this.nationalityTerm = "";
    this.awardTerm = "";
    this.suffixTerm = "";
    this.showAll = false;
  }

  get allTeams() {
    const teams = new Set();
    hofMember.forEach((player) => {
      (player.teams || []).forEach((team) => teams.add(team));
      (player.primaryTeam || []).forEach((team) => teams.add(team));
    });
    return ["All Teams", ...Array.from(teams).sort()];
  }

  get allPositions() {
    const positions = new Set();
    hofMember.forEach((player) => {
      if (player.position) {
        player.position
          .split("/")
          .map((p) => p.trim())
          .forEach((pos) => positions.add(pos));
      }
    });
    positions.add("DH"); // Ensure DH is present
    return ["All Positions", ...Array.from(positions).sort()];
  }

  updateField(e, field) {
    this[field] = e.target.value;
    this.showAll = false;
  }

  clearSearch() {
    this.firstNameTerm = "";
    this.lastNameTerm = "";
    this.teamTerm = "All Teams";
    this.positionTerm = "All Positions";
    this.nationalityTerm = "";
    this.awardTerm = "";
    this.suffixTerm = "";
    this.showAll = false;
  }

  showAllPlayers() {
    this.showAll = true;
  }

  get filteredPlayers() {
    const hasSearch =
      this.firstNameTerm ||
      this.lastNameTerm ||
      (this.teamTerm && this.teamTerm !== "All Teams") ||
      (this.positionTerm && this.positionTerm !== "All Positions") ||
      this.nationalityTerm ||
      this.awardTerm ||
      this.suffixTerm;
    if (!hasSearch && !this.showAll) return [];

    return hofMember.filter(
      (player) =>
        (!this.firstNameTerm ||
          (player.firstName &&
            player.firstName
              .toLowerCase()
              .startsWith(this.firstNameTerm.toLowerCase()))) &&
        (!this.lastNameTerm ||
          (player.lastName &&
            player.lastName
              .toLowerCase()
              .startsWith(this.lastNameTerm.toLowerCase()))) &&
        (this.teamTerm === "All Teams" ||
          (player.teams && player.teams.includes(this.teamTerm)) ||
          (player.primaryTeam && player.primaryTeam.includes(this.teamTerm))) &&
        (this.positionTerm === "All Positions" ||
          (player.position &&
            player.position
              .split("/")
              .map((p) => p.trim())
              .includes(this.positionTerm))) &&
        (!this.nationalityTerm ||
          (player.nationality &&
            player.nationality
              .toLowerCase()
              .includes(this.nationalityTerm.toLowerCase()))) &&
        (!this.awardTerm ||
          (player.awards &&
            player.awards.some((award) =>
              award.toLowerCase().includes(this.awardTerm.toLowerCase())
            ))) &&
        (!this.suffixTerm ||
          (player.lastName &&
            player.lastName
              .toLowerCase()
              .endsWith(this.suffixTerm.toLowerCase())) ||
          (player.realName &&
            player.realName
              .toLowerCase()
              .endsWith(this.suffixTerm.toLowerCase())))
    );
  }

  render() {
    const sortedPlayers = this.filteredPlayers.sort((a, b) =>
      a.lastName.localeCompare(b.lastName)
    );
    return html`
      <div>
        <input
          type="text"
          placeholder="First Name"
          @input=${(e) => this.updateField(e, "firstNameTerm")}
          .value=${this.firstNameTerm}
        />
        <input
          type="text"
          placeholder="Last Name"
          @input=${(e) => this.updateField(e, "lastNameTerm")}
          .value=${this.lastNameTerm}
        />
        <input
          type="text"
          placeholder="Suffix (Jr, Sr, III, etc)"
          @input=${(e) => this.updateField(e, "suffixTerm")}
          .value=${this.suffixTerm}
        />
        <select
          @change=${(e) => this.updateField(e, "teamTerm")}
          .value=${this.teamTerm}
        >
          ${this.allTeams.map(
            (team) => html`<option value="${team}">${team}</option>`
          )}
        </select>
        <select
          @change=${(e) => this.updateField(e, "positionTerm")}
          .value=${this.positionTerm}
        >
          ${this.allPositions.map(
            (pos) => html`<option value="${pos}">${pos}</option>`
          )}
        </select>
        <input
          type="text"
          placeholder="Search by nationality..."
          @input=${(e) => this.updateField(e, "nationalityTerm")}
          .value=${this.nationalityTerm}
        />
        <input
          type="text"
          placeholder="Search by award..."
          @input=${(e) => this.updateField(e, "awardTerm")}
          .value=${this.awardTerm}
        />
        <button @click=${this.clearSearch}>Clear</button>
        <button @click=${this.showAllPlayers}>Show All</button>

        ${sortedPlayers.length === 0 &&
        (this.firstNameTerm ||
          this.lastNameTerm ||
          this.suffixTerm ||
          (this.teamTerm && this.teamTerm !== "All Teams") ||
          (this.positionTerm && this.positionTerm !== "All Positions") ||
          this.nationalityTerm ||
          this.awardTerm)
          ? html`<p><em>No players found. Try adjusting your search.</em></p>`
          : sortedPlayers.map(
              (player) => html`
                <div class="player-card">
                  <h3>${player.firstName} ${player.lastName}</h3>
                  <p>
                    <strong>Primary Team:</strong> ${player.primaryTeam.join(
                      ", "
                    )}
                  </p>
                  <p><strong>Teams:</strong> ${player.teams.join(", ")}</p>
                  <p><strong>Position:</strong> ${player.position}</p>
                  <p><strong>Nationality:</strong> ${player.nationality}</p>
                  <p><strong>Years Active:</strong> ${player.yearsActive}</p>
                  <p><strong>Bats:</strong> ${player.batHand.join(", ")}</p>
                  <p><strong>Throws:</strong> ${player.throwHand.join(", ")}</p>
                  <p><strong>Awards:</strong> ${player.awards.join("; ")}</p>
                  <p><strong>Nicknames:</strong> ${player.nickNames}</p>
                  <p><strong>Real Name:</strong> ${player.realName}</p>
                  <p><strong>DOB:</strong> ${player.birthDay}</p>
                  <p><strong>Passed Away:</strong> ${player.deathDay}</p>
                  <p><strong>Inducted:</strong> ${player.yearInducted}</p>
                  <p><strong>Player Notes:</strong> ${player.commentOne}</p>
                  <p><strong>More Notes:</strong> ${player.commentTwo}</p>
                </div>
              `
            )}
      </div>
    `;
  }
}

customElements.define("hof-search", HofSearch);
