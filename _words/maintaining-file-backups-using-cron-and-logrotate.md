---
title: Maintaining File Backups using Cron and Logrotate
date_created: 2022-06-20
date_updated: 2022-06-30
metadata: research
tags:
---
# Maintaining File Backups using Cron and Logrotate

The syncing solution that I use was designed to simply sync files between several devices. This means that any given time copies of my files would only exist on my devices and my remote server. 

For obvious reasons, this isn't ideal. There needed to be actual backups of the data that is protected in case a stray _delete all_ wipes a copy on one device and my syncing solution dutifully propagates this change. This would effectively delete everything I have without a way to backup from a known good copy of it.

## A Basic Cron Job

Initially, I thought a simple cron job run every hour would suffice in creating a backup of the data. Indeed, this would work but would inevitably lead to managing the ever-growing archive.

```bash
0 * * * * root tar -czvf /var/opt/application_name/backups/backup-`date +%Y-%m-%dT%H%M%S`.tgz data_folder/
```

Since I only need to protect against accidentally propagating a _delete all_ for this specific case, I don't need to keep a complete archive of my data. This means that I only need to have buffer copies of my data and delete older copies of the backup after a certain time.

This is effectively what `logrotate` does, so why not try that out? 

**Linux File Hierarchy Side Thing**

A little side thing that I found while I was poking around for this: The `docker-compose` file for the docker application is stored in `/opt`. If we're basing the directory on a loose interpretation of the Linux File Hierarchy, the backup data should be stored in `/var/opt/application_name/backups/`. 

The application data, if not mounted on a docker volume, should then be mounted in `/srv/application_name/`. 

## Logrotate

Logrotate should work for periodically creating another copy of the backup and deleting the old copies. Here is a sample logrotate config for creating backups of the file:

```bash
/var/opt/application_name/backup.tgz {
    maxage 7
	rotate 168
    nocompress
    extension .tar.gz
    missingok
    hourly
}
```

Some issues were encountered when looking further into the config options:
- can't set a dateformat with a precision of hours, minutes, or seconds.
- can't set a frequency shorter than `daily` by default

**Hourly Logrotate**

We can configure support for hourly logrotate by modifying the frequency of the cron job that triggers logrotate as indicated in the following snippet.

> Log files are rotated every hour.  Note that usually logrotate is configured to be run by cron daily.  You have to change this configuration and run logrotate hourly to be able to really rotate logs hourly.

Modify the execution by moving the cron job from `/etc/cron.daily/logrotate` to `/etc/cron.hourly/logrotate`. 

```bash
sudo cp /etc/cron.daily/logrotate /etc/cron.hourly/logrotate
```

Since logrotate is also executed at the turn of the hour, it might be better to execute the backup cronjob on another minute of the hour to avoid race conditions. We'll change the cron schedule from `0 * * * *` to `30 * * * *` so it executes hourly at minute 30. 

## tl;dr

```bash
echo '30 * * * * root tar -czvf /var/opt/application_name/backups/backup.tgz data_folder/' | sudo tee /etc/cron.d/file_backup
```

```bash
echo """/var/opt/application_name/backup.tgz {
    maxage 7
    rotate 168
    nocompress
    extension .tgz
    missingok
    hourly
}""" | sudo tee /etc/logrotate.d/file_backup
```

```bash
sudo cp /etc/cron.daily/logrotate /etc/cron.hourly/logrotate
```te
```
