# Backup and Restore Guide

This document describes the backup and restore procedures for the Blumea Skincare Blog application.

## MongoDB Backup

### Automated Backups

We recommend setting up automated daily backups using MongoDB Atlas or your hosting provider's backup solution.

### Manual Backup

To create a manual backup of the MongoDB database:

```bash
# Backup entire database
mongodump --uri="$MONGODB_URI" --db="$MONGODB_DBNAME" --out=/backup/$(date +%Y%m%d)

# Backup specific collection
mongodump --uri="$MONGODB_URI" --db="$MONGODB_DBNAME" --collection=articles --out=/backup/articles_$(date +%Y%m%d)
```

### Compressed Backup

```bash
mongodump --uri="$MONGODB_URI" --db="$MONGODB_DBNAME" --archive=/backup/blumea_$(date +%Y%m%d).gz --gzip
```

## Restore

### Restore from Dump

```bash
# Restore entire database
mongorestore --uri="$MONGODB_URI" --db="$MONGODB_DBNAME" /backup/20240101/blumea

# Restore specific collection
mongorestore --uri="$MONGODB_URI" --db="$MONGODB_DBNAME" --collection=articles /backup/20240101/blumea/articles.bson
```

### Restore from Compressed Archive

```bash
mongorestore --uri="$MONGODB_URI" --db="$MONGODB_DBNAME" --archive=/backup/blumea_20240101.gz --gzip
```

## Redis Backup (if using Upstash)

Upstash Redis provides automatic backups. To export data manually:

1. Log into your Upstash console
2. Navigate to your Redis instance
3. Click "Export" to download a snapshot

## Media Files

### Backup Strategy

Media files should be backed up separately:

```bash
# If using local storage
tar -czf /backup/media_$(date +%Y%m%d).tar.gz /path/to/media

# If using S3 or similar
aws s3 sync s3://your-bucket/media /backup/media_$(date +%Y%m%d)
```

### Restore Media

```bash
# From local backup
tar -xzf /backup/media_20240101.tar.gz -C /path/to/media

# From S3
aws s3 sync /backup/media_20240101 s3://your-bucket/media
```

## Environment Configuration Backup

Always maintain a secure backup of your `.env` file (without storing it in version control):

```bash
# Encrypt and backup .env
gpg --encrypt --recipient your-email@example.com .env
mv .env.gpg /secure/backup/location/
```

## Automated Backup Script

Create a backup script (`scripts/backup.sh`):

```bash
#!/bin/bash
set -e

BACKUP_DIR="/backup/blumea"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup MongoDB
echo "Backing up MongoDB..."
mongodump --uri="$MONGODB_URI" --db="$MONGODB_DBNAME" --archive="$BACKUP_DIR/$DATE/mongodb.gz" --gzip

# Backup media files
echo "Backing up media files..."
tar -czf "$BACKUP_DIR/$DATE/media.tar.gz" /path/to/media

# Clean old backups (keep last 30 days)
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} +

echo "Backup completed: $BACKUP_DIR/$DATE"
```

Schedule with cron:

```
0 2 * * * /path/to/backup.sh >> /var/log/blumea-backup.log 2>&1
```

## Disaster Recovery Plan

### Priority 1: Database Recovery (RTO: 1 hour)

1. Restore MongoDB from most recent backup
2. Verify data integrity
3. Run migrations if needed: `npm run migrate`

### Priority 2: Application Deployment (RTO: 30 minutes)

1. Deploy latest application code
2. Restore environment variables
3. Restart services

### Priority 3: Media Files (RTO: 2 hours)

1. Restore media files from backup
2. Verify file accessibility
3. Clear CDN cache if applicable

## Testing Backups

Regularly test your backups to ensure they work:

```bash
# Monthly backup test
mongorestore --uri="$TEST_MONGODB_URI" --db="blumea_test" --archive=/backup/latest/mongodb.gz --gzip

# Verify restored data
mongo "$TEST_MONGODB_URI/blumea_test" --eval "db.articles.count()"
```

## Monitoring

Set up alerts for:
- Failed backup jobs
- Low backup storage space
- Backup age > 24 hours

## Security Considerations

1. Encrypt all backups at rest
2. Store backups in a different region/datacenter
3. Limit access to backup files
4. Rotate backup encryption keys annually
5. Test disaster recovery procedures quarterly

## Contact

For backup-related issues, contact the infrastructure team or refer to your hosting provider's documentation.
