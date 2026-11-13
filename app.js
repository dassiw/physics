const phases = [
  {
    title: '1) Onboarding & Baseline Diagnostic',
    action:
      'Take a full-length adaptive practice test in Bluebook or complete Khan Academy Course Challenges in Math and Reading/Writing.',
    output: 'Baseline score report, domain breakdown, and initial skill mastery credits.',
    checks: ['Baseline test completed', 'Score report reviewed', 'Domain breakdown captured'],
  },
  {
    title: '2) Error Triage & Mapping',
    action:
      'Review missed items with the linked walkthrough course from your Bluebook scorecard and map weak domains.',
    output: 'Prioritized list of weak skills by difficulty tier.',
    checks: ['Missed questions analyzed', 'Weak skills listed', 'Difficulty tiers assigned'],
  },
  {
    title: '3) Tiered Skill Remediation',
    action:
      'Study lessons and worked examples, then complete 4-question drills across Foundations, Medium, and Advanced tiers.',
    output: 'Level Up mastery (typically 3/4 correct or better in drills).',
    checks: ['Foundation drill passed', 'Medium drill passed', 'Advanced drill passed'],
  },
  {
    title: '4) Unit Validation',
    action: 'Complete mixed-skill Unit Tests at the end of each difficulty/domain module.',
    output: 'Retention verified across mixed topics without topic-label cues.',
    checks: ['Mixed-skill unit tests completed', 'Weak-topic revisit planned where needed'],
  },
  {
    title: '5) Full-Length Simulation',
    action: 'Take a fresh, uninterrupted adaptive practice test under strict exam timing.',
    output: 'Updated benchmark score; restart loop at Phase 2 until target score or test date.',
    checks: ['Simulation completed under timing', 'Benchmark score recorded', 'Decision made: target reached or continue'],
  },
];

const state = {
  completed: new Array(phases.length).fill(false),
};

const phasesRoot = document.getElementById('phases');
const template = document.getElementById('phase-template');
const restartLoopButton = document.getElementById('restart-loop');
const loopStatus = document.getElementById('loop-status');

function isUnlocked(index) {
  if (index === 0) return true;
  return state.completed[index - 1];
}

function isFinalPhaseComplete() {
  return state.completed[4];
}

function render() {
  phasesRoot.innerHTML = '';

  phases.forEach((phase, index) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.phase-card');
    const title = fragment.querySelector('.phase-title');
    const action = fragment.querySelector('.phase-action');
    const checklist = fragment.querySelector('.checklist');
    const button = fragment.querySelector('.complete-btn');
    const output = fragment.querySelector('.phase-output');

    title.textContent = phase.title;
    action.textContent = phase.action;

    const unlocked = isUnlocked(index);
    const done = state.completed[index];

    if (!unlocked) {
      card.classList.add('locked');
    }

    phase.checks.forEach((checkText) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.disabled = !unlocked || done;
      checkbox.dataset.phase = String(index);
      checkbox.addEventListener('change', () => {
        const allChecked = [...checklist.querySelectorAll('input')].every((input) => input.checked);
        button.disabled = !allChecked || done;
      });

      const text = document.createElement('span');
      text.textContent = checkText;

      label.appendChild(checkbox);
      label.appendChild(text);
      checklist.appendChild(label);
    });

    button.disabled = !unlocked || done;
    button.textContent = done ? 'Completed' : 'Mark complete';
    button.addEventListener('click', () => {
      state.completed[index] = true;
      render();
    });

    if (done) {
      output.textContent = `Output achieved: ${phase.output}`;
    }

    phasesRoot.appendChild(fragment);
  });

  const canLoop = isFinalPhaseComplete();
  restartLoopButton.disabled = !canLoop;

  if (canLoop) {
    loopStatus.textContent = 'Simulation done. If target score is not reached, restart from Phase 2 for another cycle.';
  } else {
    loopStatus.textContent = 'Complete Phase 5 to unlock the improvement loop back to Phase 2.';
  }
}

restartLoopButton.addEventListener('click', () => {
  state.completed[1] = false;
  state.completed[2] = false;
  state.completed[3] = false;
  state.completed[4] = false;
  render();
});

render();
