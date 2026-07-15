/**
 * API Client Tests
 * Test file for verifying API connectivity
 */

// Example API calls for testing

// 1. Upload a document
async function testUpload() {
  const formData = new FormData();
  const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  formData.append('file', file);
  formData.append('title', 'Test Document');

  const response = await fetch('http://localhost:5000/api/documents/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

// 2. Ask a question
async function testChat(documentId: string, question: string) {
  const response = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId,
      question,
    }),
  });

  return response.json();
}

// 3. Get chat history
async function testHistory(documentId: string) {
  const response = await fetch(`http://localhost:5000/api/chat/${documentId}`);
  return response.json();
}

// 4. List documents
async function testList() {
  const response = await fetch('http://localhost:5000/api/documents');
  return response.json();
}

// Run tests
async function runTests() {
  try {
    console.log('Testing API endpoints...\n');

    // Test upload
    console.log('1. Testing document upload...');
    const uploadResult = await testUpload();
    console.log('✓ Upload successful:', uploadResult);

    const docId = uploadResult.documentId;

    // Test chat
    console.log('\n2. Testing chat endpoint...');
    const chatResult = await testChat(docId, 'What is this document about?');
    console.log('✓ Chat successful:', chatResult);

    // Test history
    console.log('\n3. Testing chat history...');
    const historyResult = await testHistory(docId);
    console.log('✓ History retrieved:', historyResult);

    // Test list
    console.log('\n4. Testing document list...');
    const listResult = await testList();
    console.log('✓ List successful:', listResult);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run tests
// runTests();

export { testUpload, testChat, testHistory, testList };
