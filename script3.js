

// script.js
import { html, css, LitElement } from 'https://unpkg.com/lit@2/index.js?module';
import { hofMember } from './hofPlayers.js';

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
    nameTerm: { type: String },
    teamTerm: { type: String },
    positionTerm: { type: String },
    nationalityTerm: { type: String },
    awardTerm: { type: String },
  };

  constructor() {
    super();
    this.nameTerm = '';
    this.teamTerm = '';
    this.positionTerm = '';
    this.nationalityTerm = '';
    this.awardTerm = '';
  }

  updateField(e, field) {
    this[field] = e.target.value.toLowerCase();
  }

  clearSearch() {
    this.nameTerm = '';
    this.teamTerm = '';
    this.positionTerm = '';
    this.nationalityTerm = '';
    this.awardTerm = '';
  }

  get filteredPlayers() {
    return hofMember.filter(player =>
      (!this.nameTerm ||
        player.firstName.toLowerCase().includes(this.nameTerm) ||
        player.lastName.toLowerCase().includes(this.nameTerm) ||
        (player.realName && player.realName.toLowerCase().includes(this.nameTerm)) ||
        (player.nickNames && player.nickNames.toLowerCase().includes(this.nameTerm))
      ) &&
      (!this.teamTerm ||
        player.teams.some(team => team.toLowerCase().includes(this.teamTerm)) ||
        (player.primaryTeam && player.primaryTeam.some(team => team.toLowerCase().includes(this.teamTerm)))
      ) &&
      (!this.positionTerm || (player.position && player.position.toLowerCase().includes(this.positionTerm))) &&
      (!this.nationalityTerm || (player.nationality && player.nationality.toLowerCase().includes(this.nationalityTerm))) &&
      (!this.awardTerm || player.awards.some(award => award.toLowerCase().includes(this.awardTerm)))
    );
  }

  render() {
    const sortedPlayers = this.filteredPlayers.sort((a, b) => a.lastName.localeCompare(b.lastName));

    return html`
      <div>
        <input type="text" placeholder="Search by name..." @input=${e => this.updateField(e, 'nameTerm')} .value=${this.nameTerm}>
        <input type="text" placeholder="Search by team..." @input=${e => this.updateField(e, 'teamTerm')} .value=${this.teamTerm}>
        <input type="text" placeholder="Search by position..." @input=${e => this.updateField(e, 'positionTerm')} .value=${this.positionTerm}>
        <input type="text" placeholder="Search by nationality..." @input=${e => this.updateField(e, 'nationalityTerm')} .value=${this.nationalityTerm}>
        <input type="text" placeholder="Search by award..." @input=${e => this.updateField(e, 'awardTerm')} .value=${this.awardTerm}>
        <button @click=${this.clearSearch}>Clear</button>

        ${sortedPlayers.length === 0 ? html`<p><em>No players found. Try adjusting your search.</em></p>` :
          sortedPlayers.map(player => html`
            <div class="player-card">
              <h3>${player.firstName} ${player.lastName}</h3>
              <p><strong>Primary Team:</strong> ${player.primaryTeam.join(', ')}</p>
              <p><strong>Teams:</strong> ${player.teams.join(', ')}</p>
              <p><strong>Position:</strong> ${player.position}</p>
              <p><strong>Nationality:</strong> ${player.nationality}</p>
              <p><strong>Years Active:</strong> ${player.yearsActive}</p>
              <p><strong>Bats:</strong> ${player.batHand.join(', ')}</p>
              <p><strong>Throws:</strong> ${player.throwHand.join(', ')}</p>
              <p><strong>Awards:</strong> ${player.awards.join('; ')}</p>
              <p><strong>Nicknames:</strong> ${player.nickNames}</p>
              <p><strong>Real Name:</strong> ${player.realName}</p>
              <p><strong>DOB:</strong> ${player.birthDay}</p>
              <p><strong>Passed Away:</strong> ${player.deathDay}</p>
              <p><strong>Inducted:</strong> ${player.yearInducted}</p>
              <p><strong>Player Notes:</strong> ${player.commentOne}</p>
              <p><strong>More Notes:</strong> ${player.commentTwo}</p>
            </div>
          `)
        }
      </div>
    `;
  }
}

customElements.define('hof-search', HofSearch);
