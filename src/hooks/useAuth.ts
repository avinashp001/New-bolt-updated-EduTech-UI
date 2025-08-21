// import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';

// export interface User {
//   id: string;
//   clerk_id?: string;
//   email: string;
//   full_name: string;
//   target_exam: string;
//   created_at: string;
//   updated_at: string;
// }

// export const useAuth = () => {
//   const { user: clerkUser, isLoaded, isSignedIn } = useUser();
//   const { signOut: clerkSignOut } = useClerkAuth();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log('useAuth useEffect triggered');
//     console.log('  isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'clerkUser:', clerkUser);
//     console.log('  current user state:', user);
    
//     const initializeUser = async () => {
//       console.log('  initializeUser started');
      
//       // Prevent unnecessary re-initialization if user is already set for current clerk user
//       if (isLoaded && isSignedIn && clerkUser && user && user.clerk_id === clerkUser.id) {
//         console.log('  User already initialized for current clerk user, skipping...');
//         setLoading(false);
//         return;
//       }
      
//       if (!isLoaded) {
//         console.log('  Clerk not loaded yet, waiting...');
//         setLoading(true);
//         return;
//       }
      
//       console.log('  Setting loading to true and proceeding with initialization...');
//       setLoading(true);
      
//       if (isSignedIn && clerkUser) {
//         console.log('  User is signed in, calling createOrUpdateUser...');
//         try {
//           await createOrUpdateUser(clerkUser.id, clerkUser);
//         } catch (error) {
//           console.error('Error initializing user:', error);
//           console.log('  Setting user to null due to error');
//           setUser(null);
//         }
//       } else {
//         console.log('  User not signed in or clerkUser not available, setting user to null');
//         setUser(null);
//       }
      
//       console.log('  Setting loading to false');
//       setLoading(false);
//     };

//     const createOrUpdateUser = async (userId: string, clerkUser: any) => {
//       console.log('    createOrUpdateUser called for userId:', userId);
//       try {
//         console.log('    Fetching existing user from database...');
//         const { data: existingUser, error: fetchError } = await supabase
//           .from('users')
//           .select('*')
//           .eq('clerk_id', userId)
//           .maybeSingle();

//         console.log('    Fetch result - existingUser:', existingUser, 'fetchError:', fetchError);
//         if (!existingUser || (fetchError && fetchError.code === 'PGRST116')) {
//           console.log('    User not found in DB, creating new user...');
          
//           // Ensure we have valid email from Clerk
//           const email = clerkUser.emailAddresses?.[0]?.emailAddress;
//           if (!email) {
//             throw new Error('No email address found in Clerk user data');
//           }
          
//           const newUser = {
//             id: crypto.randomUUID(),
//             clerk_id: userId,
//             email: email,
//             full_name: clerkUser.fullName || clerkUser.firstName || clerkUser.lastName || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || '',
//             target_exam: '', // Empty string indicates onboarding not completed
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           };

//           console.log('    Inserting new user:', newUser);
//           const { data: createdUser, error: createError } = await supabase
//             .from('users')
//             .insert(newUser)
//             .select()
//             .single();

//           if (createError) {
//             console.error('    Error creating user:', createError);
            
//             // Check if it's a duplicate key error (race condition)
//             if (createError.code === '23505') {
//               console.log('    Duplicate user detected, attempting retry fetch...');
//             } else {
//               console.log('    Non-duplicate error, attempting retry fetch...');
//             }
            
//             console.log('    Attempting retry fetch...');
//             // If creation fails, try to fetch again in case of race condition
//             const { data: retryUser } = await supabase
//               .from('users')
//               .select('*')
//               .eq('clerk_id', userId)
//               .single();
            
//             if (retryUser) {
//               console.log('    Retry fetch successful, setting user:', retryUser);
//               setUser(retryUser);
//             } else {
//               console.log('    Retry fetch also failed, user remains null');
//               throw new Error(`Failed to create or fetch user: ${createError.message}`);
//             }
//           } else {
//             console.log('    User created successfully, setting user:', createdUser);
//             setUser(createdUser);
//           }
//         } else {
//           console.log('    Existing user found, setting user:', existingUser);
//           setUser(existingUser);
//         }
//       } catch (error) {
//         console.error('    Error in createOrUpdateUser catch block:', error);
//         throw error; // Re-throw to be handled by the calling code
//       }
//     };


//     // NEW: Function to refresh user data from Supabase
//   const refreshUser = async () => {
//     if (!clerkUser?.id) {
//       console.warn('refreshUser called without clerkUser.id');
//       return;
//     }
//     setLoading(true);
//     try {
//       const { data: fetchedUser, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('clerk_id', clerkUser.id)
//         .maybeSingle(); // Use maybeSingle to handle no record found gracefully

//       if (error) {
//         console.error('Error refreshing user:', error);
//         throw error;
//       }
//       setUser(fetchedUser);
//     } catch (error) {
//       console.error('Failed to refresh user data:', error);
//       setUser(null); // Clear user if refresh fails
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log('useAuth useEffect triggered');
//     console.log('  isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'clerkUser:', clerkUser);
//     console.log('  current user state:', user);

//     const initializeUser = async () => {
//       console.log('  initializeUser started');

//       // Prevent unnecessary re-initialization if user is already set for current clerk user
//       if (isLoaded && isSignedIn && clerkUser && user && user.clerk_id === clerkUser.id) {
//         console.log('  User already initialized for current clerk user, skipping...');
//         setLoading(false);
//         return;
//       }

//       if (!isLoaded) {
//         console.log('  Clerk not loaded yet, waiting...');
//         setLoading(true);
//         return;
//       }

//       console.log('  Setting loading to true and proceeding with initialization...');
//       setLoading(true);

//       if (isSignedIn && clerkUser) {
//         console.log('  User is signed in, calling createOrUpdateUser...');
//         try {
//           await createOrUpdateUser(clerkUser.id, clerkUser);
//         } catch (error) {
//           console.error('Error initializing user:', error);
//           console.log('  Setting user to null due to error');
//           setUser(null);
//         }
//       } else {
//         console.log('  User not signed in or clerkUser not available, setting user to null');
//         setUser(null);
//       }

//       console.log('  Setting loading to false');
//       setLoading(false);
//     };
    
    
//     initializeUser();
//   }, [isLoaded, isSignedIn, clerkUser]);

//   const updateProfile = async (updates: Partial<User>) => {
//     if (!user) return;

//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .update({
//           ...updates,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', user.id)
//         .select()
//         .single();

//       if (error) throw error;
//       setUser(data);
//       return data;
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       throw error;
//     }
//   };

//   const signOut = async () => {
//     try {
//       await clerkSignOut();
//       setUser(null);
//     } catch (error) {
//       console.error('Error signing out:', error);
//       throw error;
//     }
//   };

//  const clearAllUserData = async () => {   // ✅ now it's async
//   if (!user) {
//     throw new Error('No user logged in');
//   }

//   try {
//     console.log('Starting to clear all user data for user:', user.id);

//     const tables = [
//       'weekly_assessments',
//       'detailed_schedules',
//       'learning_analytics',
//       'mistake_tracking',
//       'quiz_attempts',
//       'theory_study_logs',
//       'study_milestones',
//       'subject_progress',
//       'topic_mastery',
//       'uploaded_materials',
//       'progress_reports',
//       'study_sessions',
//       'study_plans',
//       'user_settings',
//       'chat_messages'
//     ];

//     let successfulDeletions = 0;
//     let failedDeletions = 0;

//     for (const table of tables) {
//       try {
//         console.log(`Attempting to clear data from table: ${table}`);
//         const { error } = await supabase
//           .from(table)
//           .delete()
//           .eq('user_id', user.id);

//         if (error) {
//           console.error(`Error deleting from ${table}:`, error);
//           failedDeletions++;
//         } else {
//           console.log(`Successfully cleared data from ${table}`);
//           successfulDeletions++;
//         }
//       } catch (tableError) {
//         console.error(`Exception while clearing ${table}:`, tableError);
//         failedDeletions++;
//       }
//     }

//     console.log(`Data clearing summary: ${successfulDeletions} successful, ${failedDeletions} failed`);

//     // Reset user profile (exam cleared)
//     const { error: userUpdateError } = await supabase
//       .from('users')
//       .update({
//         target_exam: '',
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', user.id);

//     if (userUpdateError) throw userUpdateError;

//     setUser(prev => (prev ? { ...prev, target_exam: '' } : null));

//     console.log('All user data cleared successfully');
//     return true;
//   } catch (error) {
//     console.error('Error clearing user data:', error);
//     throw error;
//   }
// };

//   return {
//     user,
//     loading: loading || !isLoaded,
//     clerkUser,
//     updateProfile,
//     signOut,
//     clearAllUserData,
//     refreshUser,
//   };
// }
            
// }


// src/hooks/useAuth.ts
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  clerk_id?: string;
  email: string;
  full_name: string;
  target_exam: string;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to create or update user in Supabase
  const createOrUpdateUser = async (userId: string, clerkUser: any) => {
    console.log('    createOrUpdateUser called for userId:', userId);
    try {
      console.log('    Fetching existing user from database...');
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', userId)
        .maybeSingle();

      console.log('    Fetch result - existingUser:', existingUser, 'fetchError:', fetchError);
      if (!existingUser || (fetchError && fetchError.code === 'PGRST116')) {
        console.log('    User not found in DB, creating new user...');

        // Ensure we have valid email from Clerk
        const email = clerkUser.emailAddresses?.[0]?.emailAddress;
        if (!email) {
          throw new Error('No email address found in Clerk user data');
        }

        const newUser = {
          id: crypto.randomUUID(),
          clerk_id: userId,
          email: email,
          full_name: clerkUser.fullName || clerkUser.firstName || clerkUser.lastName || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || '',
          target_exam: '', // Empty string indicates onboarding not completed
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('    Inserting new user:', newUser);
        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        if (createError) {
          console.error('    Error creating user:', createError);

          // Check if it's a duplicate key error (race condition)
          if (createError.code === '23505') {
            console.log('    Duplicate user detected, attempting retry fetch...');
          } else {
            console.log('    Non-duplicate error, attempting retry fetch...');
          }

          console.log('    Attempting retry fetch...');
          // If creation fails, try to fetch again in case of race condition
          const { data: retryUser } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', userId)
            .single();

          if (retryUser) {
            console.log('    Retry fetch successful, setting user:', retryUser);
            setUser(retryUser);
          } else {
            console.log('    Retry fetch also failed, user remains null');
            throw new Error(`Failed to create or fetch user: ${createError.message}`);
          }
        } else {
          console.log('    User created successfully, setting user:', createdUser);
          setUser(createdUser);
        }
      } else {
        console.log('    Existing user found, setting user:', existingUser);
        setUser(existingUser);
      }
    } catch (error) {
      console.error('    Error in createOrUpdateUser catch block:', error);
      throw error; // Re-throw to be handled by the calling code
    }
  };

  // NEW: Function to refresh user data from Supabase
  const refreshUser = async () => {
    if (!clerkUser?.id) {
      console.warn('refreshUser called without clerkUser.id');
      return;
    }
    setLoading(true);
    try {
      const { data: fetchedUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkUser.id)
        .maybeSingle(); // Use maybeSingle to handle no record found gracefully

      if (error) {
        console.error('Error refreshing user:', error);
        throw error;
      }
      setUser(fetchedUser);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      setUser(null); // Clear user if refresh fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useAuth useEffect triggered');
    console.log('  isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'clerkUser:', clerkUser);
    console.log('  current user state:', user);

    const initializeUser = async () => {
      console.log('  initializeUser started');

      // Prevent unnecessary re-initialization if user is already set for current clerk user
      if (isLoaded && isSignedIn && clerkUser && user && user.clerk_id === clerkUser.id) {
        console.log('  User already initialized for current clerk user, skipping...');
        setLoading(false);
        return;
      }

      if (!isLoaded) {
        console.log('  Clerk not loaded yet, waiting...');
        setLoading(true);
        return;
      }

      console.log('  Setting loading to true and proceeding with initialization...');
      setLoading(true);

      if (isSignedIn && clerkUser) {
        console.log('  User is signed in, calling createOrUpdateUser...');
        try {
          await createOrUpdateUser(clerkUser.id, clerkUser);
        } catch (error) {
          console.error('Error initializing user:', error);
          console.log('  Setting user to null due to error');
          setUser(null);
        }
      } else {
        console.log('  User not signed in or clerkUser not available, setting user to null');
        setUser(null);
      }

      console.log('  Setting loading to false');
      setLoading(false);
    };

    initializeUser();
  }, [isLoaded, isSignedIn, clerkUser]);

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const clearAllUserData = async () => {   // ✅ now it's async
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('Starting to clear all user data for user:', user.id);

      const tables = [
        'weekly_assessments',
        'detailed_schedules',
        'learning_analytics',
        'mistake_tracking',
        'quiz_attempts',
        'theory_study_logs',
        'study_milestones',
        'subject_progress',
        'topic_mastery',
        'uploaded_materials',
        'progress_reports',
        'study_sessions',
        'study_plans',
        'user_settings',
        'chat_messages'
      ];

      let successfulDeletions = 0;
      let failedDeletions = 0;

      for (const table of tables) {
        try {
          console.log(`Attempting to clear data from table: ${table}`);
          const { error } = await supabase
            .from(table)
            .delete()
            .eq('user_id', user.id);

          if (error) {
            console.error(`Error deleting from ${table}:`, error);
            failedDeletions++;
          } else {
            console.log(`Successfully cleared data from ${table}`);
            successfulDeletions++;
          }
        } catch (tableError) {
          console.error(`Exception while clearing ${table}:`, tableError);
          failedDeletions++;
        }
      }

      console.log(`Data clearing summary: ${successfulDeletions} successful, ${failedDeletions} failed`);

      // Reset user profile (exam cleared)
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          target_exam: '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (userUpdateError) throw userUpdateError;

      setUser(prev => (prev ? { ...prev, target_exam: '' } : null));

      console.log('All user data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  };

  return {
    user,
    loading: loading || !isLoaded,
    clerkUser,
    updateProfile,
    signOut,
    clearAllUserData,
    refreshUser, // NEW: Export refreshUser
  };
};
