import React from 'react';

function FollowersInfo({ followers = 0, following = 0 }) {
  return (
    <div className="followers-container">
      <div><strong>{followers}</strong> Followers</div>
      <div><strong>{following}</strong> Following</div>
    </div>
  );
}

export default FollowersInfo;
