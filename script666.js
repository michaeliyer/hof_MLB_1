    import { html, css, LitElement } from 'https://unpkg.com/lit@2/index.js?module';
    import { hofMember } from './hofPlayers.js';
    // const hofMember = [
    //   {
    //     firstName: "Babe",
    //     lastName: "Ruth",
    //     teams: ["Boston Red Sox", "New York Yankees", "Boston Braves"],
    //     primaryTeam: ["New York Yankees"],
    //     position: "Outfielder / Pitcher",
    //     nationality: "United States",
    //     yearsActive: "1914–1935",
    //     batHand: ["Left"],
    //     throwHand: ["Left"],
    //     awards: ["7× World Series Champion", "AL MVP (1923)", "MLB All-Century Team", "MLB All-Time Team"],
    //     birthDay: "2/6/1895",
    //     deathDay: "8/16/1948",
    //     realName: "George Herman Ruth Jr.",
    //     nickNames: "The Bambino, The Sultan of Swat",
    //     yearInducted: 1936,
    //     commentOne: "One of the original five Hall of Fame inductees.",
    //     commentTwo: "Hit 714 home runs; transformed baseball into America's pastime.",
    //   },
    //   // Add more players here as needed
    // ];

    class HofSearch extends LitElement {
      static styles = css``;

      static properties = {
        nameTerm: { type: String },
        teamTerm: { type: String },
        positionTerm: { type: String },
        nationalityTerm: { type: String },
        awardTerm: { type: String },
        showAll: { type: Boolean },
      };

      constructor() {
        super();
        this.nameTerm = '';
        this.teamTerm = '';
        this.positionTerm = '';
        this.nationalityTerm = '';
        this.awardTerm = '';
        this.showAll = false;
      }

      updateField(e, field) {
        this[field] = e.target.value.toLowerCase();
        this.showAll = false;
      }

      clearSearch() {
        this.nameTerm = '';
        this.teamTerm = '';
        this.positionTerm = '';
        this.nationalityTerm = '';
        this.awardTerm = '';
        this.showAll = false;
      }

      showAllPlayers() {
        this.showAll = true;
      }

      get filteredPlayers() {
        const hasSearch = this.nameTerm || this.teamTerm || this.positionTerm || this.nationalityTerm || this.awardTerm;
        if (!hasSearch && !this.showAll) return [];

        const nameWords = this.nameTerm.trim().toLowerCase().split(/\s+/);

        return hofMember.filter(player =>
          (!this.nameTerm || nameWords.some(word =>
            player.firstName.toLowerCase().includes(word) ||
            player.lastName.toLowerCase().includes(word) ||
            (player.realName && player.realName.toLowerCase().includes(word)) ||
            (player.nickNames && player.nickNames.toLowerCase().includes(word))
          )) &&
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
            <button @click=${this.showAllPlayers}>Show All</button>

            ${sortedPlayers.length === 0 && (this.nameTerm || this.teamTerm || this.positionTerm || this.nationalityTerm || this.awardTerm) ? html`<p><em>No players found. Try adjusting your search.</em></p>` :
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