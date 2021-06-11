import { and, or, rule, shield } from 'graphql-shield';

const checkPermissions = (user, permission) => {
  if (user && user['http://localhost:4000/graphql']) {
    return user['http://localhost:4000/graphql'].permissions.includes(
      permission
    );
  }

  return false;
};

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const canReadAnyUser = rule()((parent, args, { user }) => {
  return checkPermissions(user, 'read:any_user');
});

const canReadOwnUser = rule()((parent, { id }, { user }) => {
  return checkPermissions(user, 'read:own_user');
});

const isReadingOwnUser = rule()((parent, { id }, { user }) => {
  return user && user.sub === id;
});

export default shield({
  Query: {
    user: or(and(canReadOwnUser, isReadingOwnUser), canReadAnyUser),
    me: isAuthenticated,
  },
});
