import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Camera, Settings, CreditCard as Edit, MapPin, Calendar, Heart, Info, Globe, Plus } from 'lucide-react-native';
import { User } from '@/utils/types';
import { getAvailableInterests } from '@/utils/mockData';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - spacing.l * 2 - spacing.s * 2) / 3;

export default function ProfileScreen() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [bio, setBio] = useState(user?.bio || '');
  
  if (!user) {
    router.replace('/(auth)/welcome');
    return null;
  }
  
  const availableInterests = getAvailableInterests().filter(
    interest => !selectedInterests.includes(interest)
  );
  
  const handleAddInterest = (interest: string) => {
    if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would be an API call
    updateUserProfile({
      interests: selectedInterests,
      bio,
    });
    setIsEditing(false);
  };
  
  const toggleEdit = () => {
    if (isEditing) {
      // Discard changes
      setSelectedInterests(user.interests);
      setBio(user.bio);
    }
    setIsEditing(!isEditing);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading2">Profile</Text>
        
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => router.push('/(tabs)/settings')}
        >
          <Settings size={24} color={colors.neutral[800]} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.photos[0] }}
            style={styles.profilePhoto}
          />
          
          <View style={styles.profileInfo}>
            <Text variant="heading3">
              {user.name}, {user.age}
            </Text>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.neutral[600]} />
              <Text variant="body" color={colors.neutral[600]}>
                {user.location}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={toggleEdit}
            >
              <Edit size={16} color={isEditing ? colors.error[500] : colors.primary[600]} />
              <Text 
                variant="bodyBold" 
                color={isEditing ? colors.error[500] : colors.primary[600]}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Info size={18} color={colors.neutral[700]} />
              <Text variant="heading3">About Me</Text>
            </View>
            
            {isEditing && (
              <TouchableOpacity style={styles.editBioButton}>
                <Edit size={16} color={colors.primary[600]} />
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing ? (
            <TouchableOpacity 
              style={styles.bioEditContainer}
              onPress={() => {
                // Open bio edit modal/screen in a real app
                setBio('I love hiking, photography, and trying new restaurants. Looking for someone who shares similar interests and enjoys spending time outdoors.');
              }}
            >
              <Text variant="body" color={bio ? colors.neutral[800] : colors.neutral[400]}>
                {bio || 'Tap to add a bio'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text variant="body" color={colors.neutral[800]} style={styles.bioText}>
              {bio || 'No bio yet'}
            </Text>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Heart size={18} color={colors.neutral[700]} />
              <Text variant="heading3">Interests</Text>
            </View>
          </View>
          
          <View style={styles.interestsContainer}>
            {selectedInterests.map((interest) => (
              <View key={interest} style={styles.interestTag}>
                <Text variant="caption" color={colors.primary[700]}>
                  {interest}
                </Text>
                
                {isEditing && (
                  <TouchableOpacity
                    style={styles.removeInterestButton}
                    onPress={() => handleRemoveInterest(interest)}
                  >
                    <Text variant="caption" color={colors.error[500]}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            {isEditing && selectedInterests.length < 5 && (
              <TouchableOpacity
                style={styles.addInterestButton}
                onPress={() => {
                  // In a real app, show a modal with options
                  if (availableInterests.length > 0) {
                    handleAddInterest(availableInterests[0]);
                  }
                }}
              >
                <Plus size={16} color={colors.primary[600]} />
                <Text variant="caption" color={colors.primary[600]}>
                  Add Interest
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Camera size={18} color={colors.neutral[700]} />
              <Text variant="heading3">Photos</Text>
            </View>
            
            {isEditing && (
              <TouchableOpacity style={styles.editPhotosButton}>
                <Edit size={16} color={colors.primary[600]} />
                <Text variant="caption" color={colors.primary[600]}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.photosGrid}>
            {user.photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
              </View>
            ))}
            
            {isEditing && user.photos.length < 6 && (
              <TouchableOpacity style={styles.addPhotoButton}>
                <Plus size={24} color={colors.neutral[400]} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Globe size={18} color={colors.neutral[700]} />
              <Text variant="heading3">Preferences</Text>
            </View>
          </View>
          
          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceItem}>
              <Text variant="body" color={colors.neutral[700]}>
                I am
              </Text>
              <Text variant="bodyBold">
                {user.gender === 'male' ? 'Man' : user.gender === 'female' ? 'Woman' : 'Non-binary'}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text variant="body" color={colors.neutral[700]}>
                Looking for
              </Text>
              <Text variant="bodyBold">
                {user.lookingFor === 'men' 
                  ? 'Men' 
                  : user.lookingFor === 'women' 
                    ? 'Women' 
                    : 'Everyone'}
              </Text>
            </View>
          </View>
        </View>
        
        {isEditing && (
          <Button
            title="Save Profile"
            onPress={handleSaveProfile}
            size="large"
            style={styles.saveButton}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.s,
    paddingBottom: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  settingsButton: {
    padding: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: spacing.l,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.s,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s,
    alignSelf: 'flex-start',
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bioText: {
    lineHeight: typography.sizes.m * 1.5,
  },
  bioEditContainer: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.m,
    padding: spacing.m,
    minHeight: 100,
  },
  editBioButton: {
    padding: spacing.xs,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  removeInterestButton: {
    marginLeft: spacing.xs,
  },
  addInterestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary[300],
    borderStyle: 'dashed',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: borderRadius.m,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  preferencesContainer: {
    gap: spacing.m,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.m,
  },
  saveButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
});