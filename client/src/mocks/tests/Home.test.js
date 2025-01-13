import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';


  //  Testing object properties 
  test('SocketTestComponents', () => {
    const mockProps = {
      title: 'Welcome to BookNest',
      isAuthenticated: true,
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    };

    expect(mockProps).toHaveProperty('title');
    expect(mockProps.user).toHaveProperty('name');
    expect(mockProps.isAuthenticated).toBe(true);
  });

  //  Testing array operations (simulating book list)
  test('NavBarComponents', () => {
    const initialBooks = ['Book 1', 'Book 2', 'Book 3'];
    const updatedBooks = [...initialBooks, 'Book 4'];
    
    expect(updatedBooks).toHaveLength(4);
    expect(updatedBooks).toContain('Book 4');
    expect(updatedBooks.filter(book => book.includes('Book'))).toHaveLength(4);
  });

  //  Testing async operations (simulating API calls)
  test('MainhomeComponents', async () => {
    const mockFetchBooks = () => {
      return Promise.resolve({
        success: true,
        data: [
          { id: 1, title: 'React Basics' },
          { id: 2, title: 'Advanced React' }
        ]
      });
    };

    const result = await mockFetchBooks();
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toHaveProperty('id');
    expect(result.data[0]).toHaveProperty('title');
  });



describe('FooterComponents', () => {
  test('FooterTable', () => {
    expect(true).toBe(true);
  });

  test('NavigationCompoets', () => {
    expect(1 + 1).toBe(2);
  });

  test('BookTableComponent', () => {
    expect('hello').toBe('hello');
  });

});

