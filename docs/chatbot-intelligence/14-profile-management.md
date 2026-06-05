# 14 — Profile Management

## Goal
`PROFILE_MANAGEMENT` → maps to intents: `VIEW_PROFILE`, `UPDATE_PROFILE`, `CHANGE_PASSWORD`, `RESET_PASSWORD`, `GDPR_EXPORT`, `GDPR_DELETE`

## Description
User wants to view, update, or manage their account profile — name, email, phone, avatar, password, or data privacy.

## Action Mapping
| Intent | Action |
|--------|--------|
| `VIEW_PROFILE` | `ProfileService.getProfile()` |
| `UPDATE_PROFILE` | `ProfileService.updateProfile()` (multi-step for name) |
| `CHANGE_PASSWORD` | Multi-step password update |
| `RESET_PASSWORD` | Navigate to /auth + forgot password |
| `GDPR_EXPORT` | `ProfileService.exportData()` |
| `GDPR_DELETE` | `ProfileService.requestDeletion()` |

## Expected Entities
| Entity | Examples |
|--------|---------|
| `field` | name, email, phone, avatar, password |
| `newValue` | "change name to John", "update email to x@y.com" |

---

## 200+ Real-World Utterances

### VIEW PROFILE
my profile
view profile
show profile
profile details
my account
account info
account details
my account details
who am i
logged in as
my info
my information
personal details
my personal info
account summary
profile summary
profile page
go to profile
open profile
profile section
show account info
view account
my name
my email
my phone number
my membership
account status

### UPDATE PROFILE
update profile
edit profile
change profile
modify profile
update my info
change my info
update my name
change my name
change name to
rename myself
update display name
change display name
set name to
my name is
new name
update email
change email
update phone
change phone number
update my phone
change my number
profile picture
update profile picture
change profile picture
upload profile photo
change avatar
update avatar
new profile picture
new avatar
profile photo

### CHANGE PASSWORD
change password
update password
modify password
new password
change my password
update my password
i want to change my password
want to update password
password change
password update
reset my password
forgot password
can't remember password
lost my password
password reset
recover password
recover account

### DATA / PRIVACY
export my data
download my data
get my data
data export
gdpr export
data portability
my data
export personal data
download personal info
right to portability
data download
privacy export
export everything
export profile

delete my account
delete account
remove my account
account deletion
i want to delete my account
close my account
deactivate account
remove all my data
erase my data
right to be forgotten
gdpr delete
data deletion
forget me
wipe my account
permanently delete

### Voice/Informal
who am i logged in as
what's my name on here
what email do i use
change my name please
update name please
new name please
edit my name
edit my profile please
profile settings
account settings
my settings
change settings
personal settings
