================
ibfindnodesusing
================

-------------------------------------------------------------------------------
find a list of end nodes which are routed through the specified switch and port
-------------------------------------------------------------------------------

:Date: 2017-08-21
:Manual section: 8
:Manual group: Open IB Diagnostics

SYNOPSIS
========

ibfindnodesusing.pl [options] <switch_guid|switch_name> <port>

DESCRIPTION
===========

ibfindnodesusing.pl uses ibroute and detects the current nodes which are routed
through both directions of the link specified.  The link is specified by one
switch port end; the script finds the remote end automatically.


OPTIONS
=======

**-h**
        show help

**-R**
        Recalculate the ibnetdiscover information, ie do not use the cached
        information.  This option is slower but should be used if the diag
        tools have not been used for some time or if there are other reasons to
        believe that the fabric has changed.

**-C <ca_name>**    use the specified ca_name.

**-P <ca_port>**    use the specified ca_port.


FILES
=====

.. Common text for the config file

CONFIG FILE
-----------

@IBDIAG_CONFIG_PATH@/ibdiag.conf

A global config file is provided to set some of the common options for all
tools.  See supplied config file for details.


.. Common text to describe the node name map file.

NODE NAME MAP FILE FORMAT
-------------------------

The node name map is used to specify user friendly names for nodes in the
output.  GUIDs are used to perform the lookup.

This functionality is provided by the opensm-libs package.  See **opensm(8)**
for the file location for your installation.

**Generically:**

::

   # comment
   <guid> "<name>"

**Example:**

::

   # IB1
   # Line cards
   0x0008f104003f125c "IB1 (Rack 11 slot 1   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f125d "IB1 (Rack 11 slot 1   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f10d2 "IB1 (Rack 11 slot 2   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f10d3 "IB1 (Rack 11 slot 2   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f10bf "IB1 (Rack 11 slot 12  ) ISR9288/ISR9096 Voltaire sLB-24D"
   
   # Spines
   0x0008f10400400e2d "IB1 (Rack 11 spine 1   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e2e "IB1 (Rack 11 spine 1   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e2f "IB1 (Rack 11 spine 1   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e31 "IB1 (Rack 11 spine 2   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e32 "IB1 (Rack 11 spine 2   ) ISR9288 Voltaire sFB-12D"
   
   # GUID   Node Name
   0x0008f10400411a08 "SW1  (Rack  3) ISR9024 Voltaire 9024D"
   0x0008f10400411a28 "SW2  (Rack  3) ISR9024 Voltaire 9024D"
   0x0008f10400411a34 "SW3  (Rack  3) ISR9024 Voltaire 9024D"
   0x0008f104004119d0 "SW4  (Rack  3) ISR9024 Voltaire 9024D"


AUTHOR
======

Ira Weiny
        < ira.weiny@intel.com >
