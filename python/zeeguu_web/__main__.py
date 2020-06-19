#!/usr/bin/env python
# -*- coding: utf8 -*-

from zeeguu_web import app

application = app.app

print("Instance folder:", application.instance_path)
application.run(
    host=application.config.get("HOST", "localhost"),
    port=application.config.get("PORT", 9000)
)
