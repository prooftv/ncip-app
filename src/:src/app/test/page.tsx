export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test Page</h1>
      <p>If you can see this, Next.js is working properly.</p>
      <p>Firebase status: <span id="firebase-status">Checking...</span></p>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          fetch('/api/firebase-test')
            .then(response => response.json())
            .then(data => {
              document.getElementById('firebase-status').textContent = 
                data.success ? 'Working' : 'Error: ' + data.error;
            })
            .catch(error => {
              document.getElementById('firebase-status').textContent = 
                'Connection Error: ' + error.message;
            });
        `
      }} />
    </div>
  );
}