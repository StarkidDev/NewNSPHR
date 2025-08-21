import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, TextField, Button,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Paper,
  Tabs, Tab, Badge, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Message, Send, Inbox, Drafts, Star, Delete, Reply, Forward, Attachment,
  Search, Add, MoreVert
} from '@mui/icons-material';

const MessagesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageOpen, setMessageOpen] = useState(false);

  const messages = [
    {
      id: 1, sender: 'HR Manager', subject: 'Welcome to GNPC', 
      preview: 'Welcome to your National Service at GNPC...', 
      timestamp: '2024-01-15T10:30:00Z', isRead: true, isStarred: false,
      body: 'Welcome to your National Service at GNPC. We are excited to have you on board...'
    },
    {
      id: 2, sender: 'Supervisor', subject: 'Monthly Report Reminder',
      preview: 'Please remember to submit your monthly report...',
      timestamp: '2024-01-20T14:20:00Z', isRead: false, isStarred: true,
      body: 'Please remember to submit your monthly report by the end of the month.'
    },
  ];

  const sentMessages = [
    {
      id: 3, recipient: 'HR Manager', subject: 'Permission Request Follow-up',
      preview: 'Following up on my permission request...',
      timestamp: '2024-01-18T09:15:00Z'
    },
  ];

  const drafts = [
    {
      id: 4, recipient: 'Supervisor', subject: 'Project Update',
      preview: 'I wanted to update you on the progress...',
      timestamp: '2024-01-19T16:30:00Z'
    },
  ];

  const getCurrentMessages = () => {
    switch (currentTab) {
      case 0: return messages;
      case 1: return sentMessages;
      case 2: return drafts;
      default: return messages;
    }
  };

  const getUnreadCount = () => messages.filter(m => !m.isRead).length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Message sx={{ mr: 1, verticalAlign: 'middle' }} />
          Messages
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Internal communication and messaging system
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Button variant="contained" startIcon={<Add />} fullWidth sx={{ mb: 3 }}
                onClick={() => setShowCompose(true)}>
                Compose Message
              </Button>
              
              <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}
                orientation="vertical" sx={{ borderRight: 1, borderColor: 'divider' }}>
                <Tab icon={<Badge badgeContent={getUnreadCount()} color="error"><Inbox /></Badge>} 
                     label="Inbox" sx={{ alignItems: 'flex-start' }} />
                <Tab icon={<Send />} label="Sent" sx={{ alignItems: 'flex-start' }} />
                <Tab icon={<Drafts />} label="Drafts" sx={{ alignItems: 'flex-start' }} />
              </Tabs>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {currentTab === 0 ? 'Inbox' : currentTab === 1 ? 'Sent Messages' : 'Drafts'}
                </Typography>
                <TextField size="small" placeholder="Search messages..." 
                  InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }} />
              </Box>
              
              <List>
                {getCurrentMessages().map((message, index) => (
                  <React.Fragment key={message.id}>
                    <ListItem button onClick={() => { setSelectedMessage(message); setMessageOpen(true); }}
                      sx={{ 
                        bgcolor: currentTab === 0 && !message.isRead ? 'action.hover' : 'transparent',
                        borderRadius: 1, mb: 1 
                      }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {(message.sender || message.recipient || 'U').charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" 
                              fontWeight={currentTab === 0 && !message.isRead ? 'bold' : 'normal'}>
                              {message.sender || message.recipient}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" 
                              fontWeight={currentTab === 0 && !message.isRead ? 'bold' : 'normal'}>
                              {message.subject}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {message.preview}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {currentTab === 0 && message.isStarred && <Star color="warning" fontSize="small" />}
                        <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                      </Box>
                    </ListItem>
                    {index < getCurrentMessages().length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compose Message Dialog */}
      <Dialog open={showCompose} onClose={() => setShowCompose(false)} maxWidth="md" fullWidth>
        <DialogTitle>Compose Message</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>To</InputLabel>
                <Select label="To">
                  <MenuItem value="hr">HR Department</MenuItem>
                  <MenuItem value="supervisor">My Supervisor</MenuItem>
                  <MenuItem value="admin">System Administrator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Subject" placeholder="Message subject" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={8} label="Message"
                placeholder="Type your message here..." />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" startIcon={<Attachment />}>
                Attach File
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCompose(false)}>Cancel</Button>
          <Button variant="outlined" startIcon={<Drafts />}>Save Draft</Button>
          <Button variant="contained" startIcon={<Send />}>Send Message</Button>
        </DialogActions>
      </Dialog>

      {/* Message Details Dialog */}
      <Dialog open={messageOpen} onClose={() => setMessageOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedMessage?.subject}</Typography>
            <Box>
              <IconButton><Star /></IconButton>
              <IconButton><Delete /></IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  From: {selectedMessage.sender} • {new Date(selectedMessage.timestamp).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedMessage.body}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Reply />}>Reply</Button>
          <Button startIcon={<Forward />}>Forward</Button>
          <Button onClick={() => setMessageOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MessagesPage;