import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>欢迎使用 Tori</h1>
      <p>这是一个使用 Electron、TypeScript 和 React 构建的桌面应用程序。</p>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => alert('Hello from React!')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007ACC',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          点击我
        </button>
      </div>
    </div>
  );
};

export default App;
