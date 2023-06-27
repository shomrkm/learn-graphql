import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Something wrong...</p>


  return (
    <div style={{ margin: '3rem' }}>
      <h1>GraphQL</h1>
      {data.users.map((user) => (
        <div key={user.id}>Name: {user.name}</div>
      ))}
    </div>
  );
}

export default App;
