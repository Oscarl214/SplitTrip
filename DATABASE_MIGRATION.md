# Database Migration for User Names

## Required Database Changes

To support user names in your SplitTrip app, you need to add a `name` column to your `profiles` table.

### SQL Migration

```sql
-- Add name column to profiles table
ALTER TABLE profiles ADD COLUMN name TEXT;

-- Optional: Add an index for better performance when querying by name
CREATE INDEX idx_profiles_name ON profiles(name);
```

### What This Enables

1. **User Profile Setup**: New users will be prompted to enter their name after first login
2. **Name Display**: Group members will be shown by name instead of email
3. **Better UX**: More personalized experience throughout the app

### Implementation Details

- The `name` field is optional (nullable) to support existing users
- New users are redirected to `/profile-setup` if they don't have a name
- Group member queries now join with the profiles table to get names
- Fallback to email if name is not available

### Files Modified

- `app/provider/authContext.tsx` - Added name to SessionType interface
- `app/hooks/session.tsx` - Added name to SessionType interface  
- `app/profile-setup.tsx` - New screen for name input
- `app/app-content.tsx` - Check for name and redirect to setup if missing
- `app/(tabs)/group.tsx` - Updated to show names in member list

### Next Steps

1. Run the SQL migration on your Supabase database
2. Test the profile setup flow with new users
3. Verify that existing users can still access the app (they'll be prompted to add their name)
4. Update expense tracking components to use real names instead of hardcoded ones
