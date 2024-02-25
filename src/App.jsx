import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleFormAddFriends(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id == friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id == selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && (
          <FormAddFriend onHandleFriend={handleFormAddFriends} />
        )}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friend
            key={friend.id}
            friend={friend}
            selectedFriend={selectedFriend}
            onSelection={onSelection}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelection }) {
  const { id, name, image, balance } = friend;

  const isSelected = selectedFriend?.id == id;

  return (
    <li className={`${isSelected ? 'selected' : ''}`}>
      <img src={image} alt='name' />
      <h3>{name}</h3>
      {balance < 0 && (
        <p className='red'>
          You Owe {name} {balance}$
        </p>
      )}
      {balance > 0 && (
        <p className='green'>
          {name} owes you {balance} $
        </p>
      )}
      {balance == 0 && <p>You and {name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className='button'>
      {children}
    </button>
  );
}

function FormAddFriend({ onHandleFriend }) {
  const [image, setImage] = useState('https://i.pravatar.cc/48');
  const [name, setName] = useState('');

  function handleFriendName(e) {
    setName(e.target.value);
  }

  function handleImageURL(e) {
    setImage(e.target.value);
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    }
    const id = crypto.randomUUID();
    const newItem = {
      id,
      image: `${image}?=${id}`,
      name,
      balance: 0,
    };

    onHandleFriend(newItem);
    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form onSubmit={onSubmitHandler} action='' className='form-add-friend'>
      <label htmlFor=''>👯‍♀️Friend Name</label>
      <input type='text' value={name} onChange={handleFriendName} />
      <label htmlFor=''>📷 Image URL</label>
      <input type='text' value={image} onChange={handleImageURL} />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const { name } = selectedFriend;
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');

  const paidByFrnd = bill ? bill - paidByUser : '';

  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function handleBill(e) {
    setBill(Number(e.target.value));
  }

  function handleMyExpense(e) {
    setPaidByUser(
      Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
    );
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    if (!bill | !paidByUser) return;
    onSplitBill(whoIsPaying == 'user' ? paidByFrnd : -paidByUser);
  }

  return (
    <form className='form-split-bill' onSubmit={onSubmitHandler}>
      <h2>Split bill with {name}</h2>

      <label htmlFor=''>💲Bill Value</label>
      <input type='text' value={bill} onChange={handleBill} />

      <label htmlFor=''>🎅 Your Expense</label>
      <input type='text' value={paidByUser} onChange={handleMyExpense} />

      <label htmlFor=''>👯‍♀️{name}'s Expense</label>
      <input type='text' disabled value={paidByFrnd} />

      <label htmlFor=''>🤑 Who's paying the bill</label>

      <select
        name=''
        id=''
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
