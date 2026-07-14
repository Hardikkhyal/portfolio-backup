const { exec } = require('child_process');
exec('git checkout src/components/Experiment.tsx', (err, stdout, stderr) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
});
