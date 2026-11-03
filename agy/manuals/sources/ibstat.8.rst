======
ibstat
======

------------------------------------------
query basic status of InfiniBand device(s)
------------------------------------------

:Date: 2017-08-21
:Manual section: 8
:Manual group: Open IB Diagnostics

SYNOPSIS
========

ibstat [options] <ca_name> [portnum]

DESCRIPTION
===========

ibstat is a binary which displays basic information obtained from the local
IB driver. Output includes LID, SMLID, port state, link width active, and port
physical state.

It is similar to the ibstatus utility but implemented as a binary rather
than a script. It has options to list CAs and/or ports and displays more
information than ibstatus.

OPTIONS
=======

**-l, --list_of_cas**
        list all IB devices

**-s, --short**
        short output

**-p, --port_list**
        show port list

**ca_name**
        InfiniBand device name

**portnum**
        port number of InfiniBand device



Debugging flags
---------------

.. Define the common option -d

-d
        raise the IB debugging level.
        May be used several times (-ddd or -d -d -d).


.. Define the common option -h

**-h, --help**      show the usage message


.. Define the common option -v

**-v, --verbose**
        increase the application verbosity level.
        May be used several times (-vv or -v -v -v)


.. Define the common option -V

**-V, --version**     show the version info.


Configuration flags
-------------------

.. Define the common option -z

**--config, -z  <config_file>** Specify alternate config file.

        Default: @IBDIAG_CONFIG_PATH@/ibdiag.conf


EXAMPLES
========

::

        ibstat            # display status of all ports on all IB devices
        ibstat -l         # list all IB devices
        ibstat -p         # show port guids
        ibstat mthca0 2   # show status of port 2 of 'mthca0'

SEE ALSO
========
ibstatus (8)

AUTHOR
======

Hal Rosenstock
        < halr@voltaire.com >
