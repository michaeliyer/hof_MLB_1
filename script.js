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
      background-color: dodgerblue;
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
    raceTerm: { type: String },
    awardTerm: { type: String },
    suffixTerm: { type: String },
    showAll: { type: Boolean },
    openPlayers: { type: Array },
  };

  constructor() {
    super();
    this.firstNameTerm = "";
    this.lastNameTerm = "";
    this.teamTerm = "Select Team";
    this.positionTerm = "Select Position";
    this.nationalityTerm = "Select Nationality";
    this.raceTerm = "Select Race";
    this.awardTerm = "";
    this.suffixTerm = "";
    this.showAll = false;
    this.openPlayers = [];
  }

  get allTeams() {
    const teams = new Set();
    hofMember.forEach((player) => {
      (player.teams || []).forEach((team) => teams.add(team));
      (player.primaryTeam || []).forEach((team) => teams.add(team));
    });
    return ["Select Team", ...Array.from(teams).sort()];
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
    return ["Select Position", ...Array.from(positions).sort()];
  }

  get allNationalities() {
    const nationalities = new Set();
    hofMember.forEach((player) => {
      if (player.nationality && player.nationality.trim())
        nationalities.add(player.nationality);
    });
    return ["Select Nationality", ...Array.from(nationalities).sort()];
  }

  get allRaces() {
    const races = new Set();
    hofMember.forEach((player) => {
      if (player.race && player.race.trim()) races.add(player.race);
    });
    return ["Select Race", ...Array.from(races).sort()];
  }

  updateField(e, field) {
    this[field] = e.target.value;
    this.showAll = false;
  }

  openPlayer(player) {
    if (
      !this.openPlayers.some(
        (p) =>
          p.firstName === player.firstName &&
          p.lastName === player.lastName &&
          p.birthDay === player.birthDay
      )
    ) {
      this.openPlayers = [...this.openPlayers, player];
    }
  }

  closePlayer(player) {
    this.openPlayers = this.openPlayers.filter(
      (p) =>
        !(
          p.firstName === player.firstName &&
          p.lastName === player.lastName &&
          p.birthDay === player.birthDay
        )
    );
  }

  clearSearch() {
    this.firstNameTerm = "";
    this.lastNameTerm = "";
    this.teamTerm = "Select Team";
    this.positionTerm = "Select Position";
    this.nationalityTerm = "Select Nationality";
    this.raceTerm = "Select Race";
    this.awardTerm = "";
    this.suffixTerm = "";
    this.showAll = false;
    this.openPlayers = [];
  }

  showAllPlayers() {
    this.showAll = true;
  }

  get filteredPlayers() {
    const hasSearch =
      this.firstNameTerm ||
      this.lastNameTerm ||
      (this.teamTerm && this.teamTerm !== "Select Team") ||
      (this.positionTerm && this.positionTerm !== "Select Position") ||
      (this.nationalityTerm && this.nationalityTerm !== "Select Nationality") ||
      (this.raceTerm && this.raceTerm !== "Select Race") ||
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
        (this.teamTerm === "Select Team" ||
          (player.teams && player.teams.includes(this.teamTerm)) ||
          (player.primaryTeam && player.primaryTeam.includes(this.teamTerm))) &&
        (this.positionTerm === "Select Position" ||
          (player.position &&
            player.position
              .split("/")
              .map((p) => p.trim())
              .includes(this.positionTerm))) &&
        (this.nationalityTerm === "Select Nationality" ||
          (player.nationality &&
            player.nationality === this.nationalityTerm)) &&
        (this.raceTerm === "Select Race" ||
          (player.race && player.race === this.raceTerm)) &&
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

  getFilteredCountMap(field, options) {
    // For each option, count players matching all filters except the one for this field
    const counts = {};
    options.forEach((option) => {
      if (option.startsWith("Select")) {
        counts[option] = null;
        return;
      }
      counts[option] = hofMember.filter((player) => {
        // Apply all filters except the one for this field
        if (
          field !== "teamTerm" &&
          this.teamTerm !== "Select Team" &&
          !(player.teams && player.teams.includes(this.teamTerm)) &&
          !(player.primaryTeam && player.primaryTeam.includes(this.teamTerm))
        ) {
          return false;
        }
        if (
          field !== "positionTerm" &&
          this.positionTerm !== "Select Position" &&
          !(
            player.position &&
            player.position
              .split("/")
              .map((p) => p.trim())
              .includes(this.positionTerm)
          )
        ) {
          return false;
        }
        if (
          field !== "nationalityTerm" &&
          this.nationalityTerm !== "Select Nationality" &&
          (!player.nationality || player.nationality !== this.nationalityTerm)
        ) {
          return false;
        }
        if (
          field !== "raceTerm" &&
          this.raceTerm !== "Select Race" &&
          (!player.race || player.race !== this.raceTerm)
        ) {
          return false;
        }
        if (
          this.firstNameTerm &&
          (!player.firstName ||
            !player.firstName
              .toLowerCase()
              .startsWith(this.firstNameTerm.toLowerCase()))
        ) {
          return false;
        }
        if (
          this.lastNameTerm &&
          (!player.lastName ||
            !player.lastName
              .toLowerCase()
              .startsWith(this.lastNameTerm.toLowerCase()))
        ) {
          return false;
        }
        if (
          this.suffixTerm &&
          !(
            player.lastName &&
            player.lastName
              .toLowerCase()
              .endsWith(this.suffixTerm.toLowerCase())
          ) &&
          !(
            player.realName &&
            player.realName
              .toLowerCase()
              .endsWith(this.suffixTerm.toLowerCase())
          )
        ) {
          return false;
        }
        if (
          this.awardTerm &&
          (!player.awards ||
            !player.awards.some((award) =>
              award.toLowerCase().includes(this.awardTerm.toLowerCase())
            ))
        ) {
          return false;
        }
        // For team, skip null/empty
        if (field === "teamTerm" && option && option !== "Select Team") {
          if (
            !(player.teams && player.teams.includes(option)) &&
            !(player.primaryTeam && player.primaryTeam.includes(option))
          ) {
            return false;
          }
        }
        // For position, skip null/empty
        if (
          field === "positionTerm" &&
          option &&
          option !== "Select Position"
        ) {
          if (
            !(
              player.position &&
              player.position
                .split("/")
                .map((p) => p.trim())
                .includes(option)
            )
          ) {
            return false;
          }
        }
        // For nationality, skip null/empty
        if (
          field === "nationalityTerm" &&
          option &&
          option !== "Select Nationality"
        ) {
          if (!player.nationality || player.nationality !== option) {
            return false;
          }
        }
        // For race, skip null/empty
        if (field === "raceTerm" && option && option !== "Select Race") {
          if (!player.race || player.race !== option) {
            return false;
          }
        }
        return true;
      }).length;
    });
    return counts;
  }

  render() {
    const sortedPlayers = this.filteredPlayers.sort((a, b) =>
      a.lastName.localeCompare(b.lastName)
    );
    const teamCounts = this.getFilteredCountMap("teamTerm", this.allTeams);
    const positionCounts = this.getFilteredCountMap(
      "positionTerm",
      this.allPositions
    );
    const nationalityCounts = this.getFilteredCountMap(
      "nationalityTerm",
      this.allNationalities
    );
    const raceCounts = this.getFilteredCountMap("raceTerm", this.allRaces);

    // Lead-in summaries
    let leadIn = "";
    if (
      this.showAll &&
      !this.firstNameTerm &&
      !this.lastNameTerm &&
      !this.suffixTerm &&
      this.teamTerm === "Select Team" &&
      this.positionTerm === "Select Position" &&
      this.nationalityTerm === "Select Nationality" &&
      this.raceTerm === "Select Race" &&
      !this.awardTerm
    ) {
      const count = this.filteredPlayers.length;
      leadIn = `There ${count === 1 ? "is" : "are"} ${count} Hall of Famer${
        count === 1 ? "" : "s"
      } in the database.`;
    } else if (this.raceTerm && this.raceTerm !== "Select Race") {
      const count = this.filteredPlayers.length;
      leadIn = `There ${count === 1 ? "is" : "are"} ${count} ${
        this.raceTerm
      } player${count === 1 ? "" : "s"} in the Hall of Fame.`;
    } else if (
      this.nationalityTerm &&
      this.nationalityTerm !== "Select Nationality"
    ) {
      const count = this.filteredPlayers.length;
      leadIn = `There ${count === 1 ? "is" : "are"} ${count} ${
        this.nationalityTerm
      } Hall of Famer${count === 1 ? "" : "s"}.`;
    } else if (this.teamTerm && this.teamTerm !== "Select Team") {
      const count = this.filteredPlayers.length;
      leadIn = `There ${count === 1 ? "is" : "are"} ${count} player${
        count === 1 ? "" : "s"
      } who played for the ${this.teamTerm}.`;
    } else if (this.positionTerm && this.positionTerm !== "Select Position") {
      const count = this.filteredPlayers.length;
      leadIn = `There ${count === 1 ? "is" : "are"} ${count} Hall of Famer${
        count === 1 ? "" : "s"
      } who played ${this.positionTerm}.`;
    }

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
            (team) =>
              html`<option value="${team}">
                ${team}${teamCounts[team] !== null
                  ? ` (${teamCounts[team]})`
                  : ""}
              </option>`
          )}
        </select>
        <select
          @change=${(e) => this.updateField(e, "positionTerm")}
          .value=${this.positionTerm}
        >
          ${this.allPositions.map(
            (pos) =>
              html`<option value="${pos}">
                ${pos}${positionCounts[pos] !== null
                  ? ` (${positionCounts[pos]})`
                  : ""}
              </option>`
          )}
        </select>
        <select
          @change=${(e) => this.updateField(e, "nationalityTerm")}
          .value=${this.nationalityTerm}
        >
          ${this.allNationalities.map(
            (nat) =>
              html`<option value="${nat}">
                ${nat}${nationalityCounts[nat] !== null
                  ? ` (${nationalityCounts[nat]})`
                  : ""}
              </option>`
          )}
        </select>
        <select
          @change=${(e) => this.updateField(e, "raceTerm")}
          .value=${this.raceTerm}
        >
          ${this.allRaces.map(
            (race) =>
              html`<option value="${race}">
                ${race}${raceCounts[race] !== null
                  ? ` (${raceCounts[race]})`
                  : ""}
              </option>`
          )}
        </select>
        <input
          type="text"
          placeholder="Search by award..."
          @input=${(e) => this.updateField(e, "awardTerm")}
          .value=${this.awardTerm}
        />
        <button @click=${this.clearSearch}>Clear</button>
        <button @click=${this.showAllPlayers}>Show All</button>

        ${leadIn
          ? html`<p style="font-weight:bold; margin-top:1em;">${leadIn}</p>`
          : ""}

        <div>
          ${sortedPlayers.length === 0 &&
          (this.firstNameTerm ||
            this.lastNameTerm ||
            this.suffixTerm ||
            (this.teamTerm && this.teamTerm !== "Select Team") ||
            (this.positionTerm && this.positionTerm !== "Select Position") ||
            (this.nationalityTerm &&
              this.nationalityTerm !== "Select Nationality") ||
            (this.raceTerm && this.raceTerm !== "Select Race") ||
            this.awardTerm)
            ? html`<p><em>No players found. Try adjusting your search.</em></p>`
            : html`
                <ul style="list-style:none; padding:0;">
                  ${sortedPlayers.map(
                    (player) => html`
                      <li style="margin-bottom:0.5em;">
                        <a
                          href="#"
                          @click=${(e) => {
                            e.preventDefault();
                            this.openPlayer(player);
                          }}
                          style="cursor:pointer; color:navy; text-decoration:underline; font-weight:bold;"
                        >
                          ${player.firstName} ${player.lastName}
                        </a>
                      </li>
                    `
                  )}
                </ul>
              `}
        </div>

        <div>
          ${this.openPlayers.map(
            (player) => html`
              <div class="player-card">
                <button
                  style="float:right; font-size:1.2em; background:none; border:none; cursor:pointer; color:#fff; font-weight:bold;"
                  @click=${() => this.closePlayer(player)}
                >
                  ×
                </button>
                <h3>${player.firstName} ${player.lastName}</h3>
                <p>
                  <strong>Primary Team:</strong> ${player.primaryTeam.join(
                    ", "
                  )}
                </p>
                <p><strong>Teams:</strong> ${player.teams.join(", ")}</p>
                <p><strong>Position:</strong> ${player.position}</p>
                <p><strong>Nationality:</strong> ${player.nationality}</p>
                <p><strong>Race:</strong> ${player.race}</p>
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
      </div>
    `;
  }
}

customElements.define("hof-search", HofSearch);
