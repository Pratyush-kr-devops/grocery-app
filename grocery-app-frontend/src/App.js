import React from 'react';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Online Grocery Store</h1>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  );
}

export default App;
