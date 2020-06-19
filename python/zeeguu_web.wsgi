#!/bin/env python
import sys
from zeeguu_web.app import app as application

application.logger.debug (application.instance_path)


if len(sys.argv) > 1 and sys.argv[1] == "run":
    # Uncomment following lines if you want to try this out w/o wsgi
    application.run(
        host=application.config.get("HOST", "localhost"),
        port=application.config.get("PORT", 9000)
    )
